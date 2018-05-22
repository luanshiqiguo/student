<?php

namespace App\Http\Controllers;

use App\Common\StFetch;
use App\Common\StValidator;
use App\PasswordReset;
use App\User;
use Illuminate\Support\Facades\Auth;


use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Common\IDMaker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthenticateController extends Controller
{
    /**
     * @param $credentials
     * @param $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function signInAttempt($credentials, &$token)
    {
        try {
            // attempt to verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        return null;
    }

    public function signInOfTeacher(Request $request){

        StValidator::make($request->all(),[
            'email'=>'required|email',
            'password'=>'required|string',
        ]);

        $credentials = StFetch::fetch($request,['email','password'],['privilege' => 2]);
        if($response = $this->signInAttempt($credentials,$token)){
            return $response;
        }

        // all good so return the token
        return [
            'error' => 0,
            'userInfo' => StFetch::fetch(
                Auth::user(),
                ['stuId','name','email','class','groupId']
            ),
            'token' => $token,
        ];
    }

    public function signIn(Request $request){

        StValidator::make($request->all(),[
            'stuId'=>'required|string',
            'password'=>'required|string',
        ]);

        $credentials = StFetch::fetch($request,['stuId','password'],['privilege' => 1]);
        if($response = $this->signInAttempt($credentials,$token)){
            return $response;
        }

        $user = Auth::user();
        $teacherName = User::where('id',$user['teacherId'])
            ->select('name')
            ->first();

        $userInfo = StFetch::fetch(
            Auth::user(),
            ['stuId','name','email','class','groupId','random','basicKnowledge'],
            [
                'teacherName' => $teacherName['name'],
                'likes' => json_decode($user['likes']),
                'characters' => json_decode($user['characters'])
            ]
        );

        // all good so return the token
        return [
            'error' => 0,
            'userInfo' => $userInfo,
            'token' => $token,
        ];
    }

    public function refresh(Request $request)
    {
        StValidator::make($request->all(),[
            'token'=>'required|string',
        ]);

        try {
            if(!$token = JWTAuth::refresh($request['token'])){
                return response()->json(['error' => 'refresh_token_error'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong whilst attempting to encode the token
            return response()->json(['error' => 'bad_token_to_refresh'], 500);
        }

        return [
            'error' => 0,
            'token' => $token,
        ];
    }

    public function signOut(Request $request){
        StValidator::make($request->all(),[
            'token'=>'required|string',
        ]);

        try {
            JWTAuth::invalidate($request->token);
        } catch (JWTException $e){
            return ['error' => 'invalidate_fail'];
        }
        return ['error' => 0];
    }


    public function user(Request $request)
    {

        $user = Auth::user();
        $teacherName = User::where('id',$user['teacherId'])
            ->select('name')
            ->first();

        $userInfo = StFetch::fetch(
            Auth::user(),
            ['stuId','name','email','class','groupId','random','basicKnowledge'],
            [
                'teacherName' => $teacherName['name'],
                'likes' => json_decode($user['likes']),
                'characters' => json_decode($user['characters'])
            ]
        );

        return [
            'error' => 0,
            'userInfo' => $userInfo
        ];
    }

    public function changePassword(Request $request)
    {
        StValidator::make($request->all(),[
            'srcPassword'=>'required|string',
            'newPassword'=>'required|string',
        ]);

        $user = Auth::user();

        if(!Hash::check($request['srcPassword'],$user['password'])){
            return ['error' => 'bad_src_password'];
        }

        $user['password'] = bcrypt($request['newPassword']);
        $user->save();
        return ['error' => 0];
    }


    public function changeEmail(Request $request){
        StValidator::make($request->all(),[
            'password' => 'required',
            'newEmail' => 'required|email|unique:users,email'
        ]);

        $user = Auth::user();

        if(!Hash::check($request['password'],$user['password'])){
            return ['error' => 'bad_password'];
        }

        $user['email'] = $request['newEmail'];
        $user->save();
        return ['error' =>0 ];

    }

    protected function createPasswordReset($data)
    {
        return PasswordReset::create([
            'stuId' => $data['stuId'],
            'token' => IDMaker::guid(),
        ]);
    }

    public function forgetPassword(Request $request){
        StValidator::make($request->all(),[
            'stuId' => 'required',
            'email' => 'required|email'
        ]);

        $user = User::where('stuId',$request->stuId)->first();

        if(!$user){
            return['error' => 'invalid_stuId'];
        }

        if ($user['email']!==$request->email){
            return ['error' => 'map_error'];
        }

        //发送邮件
        $passwordReset = $this->createPasswordReset($request->all());

        $this->sendResetEmail($passwordReset, $user);

        return['error' => 0];
    }

    //发送邮件
    public function sendResetEmail($passwordReset,$data)
    {
        $user = [
            'stuId' => $data->stuId,
            'name' => $data->name,
            'token' => $passwordReset['token'],
            'email' => $data->email,
            'url' => 'http://mt.wtulip.com/st/',
        ];

        Mail::send('email.forget_password',$user , function($message) use($user)
        {
            $message->to($user['email'], PRODUCT_NAME.' user')->subject(PRODUCT_NAME.' 重置密码!');
        });

        return $user;
    }

    public function resetPassword(Request $request){
        StValidator::make($request->all(),[
            'stuId' => 'required',
            'token' => 'required',
            'newPassword' => 'required'
        ]);

        $record = PasswordReset::where('stuId','=',$request['stuId'])->where('token','=',$request['token'])->first();
        if(!$record){
            return ['error' => 'bad_token'];
        }

        if(User::where('stuId','=',$request['stuId'])->update(['password' => bcrypt($request['newPassword'])])){
            PasswordReset::where('stuId','=',$request['stuId'])
                ->where('token','=',$request['token'])
                ->delete();
            return ['error' => 0];
        } else {
            return ['error' => 'db_update_fails'];
        }
    }

    public function updateStuInfo(Request $request){
        if (!count($request->all())){
            return[
                'error' => 'bad_parameter'
            ];
        }

        $user = Auth::user();

        foreach ($request->all() as $key => $value){
            if($key == 'likes' || $key == 'characters'){
                $value = json_encode($value,JSON_UNESCAPED_UNICODE);
            }
            $user[$key] = $value;
        }

        $user->save();

        return [
            'error' => 0
        ];
    }

}
