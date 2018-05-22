<?php

namespace App\Http\Controllers;

use App\Common\StValidator;
use App\Feedback;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


use App\Http\Requests;
use App\Http\Controllers\Controller;

class FeedBackController extends Controller
{

    /**
     *存储学生反馈
     */
    public function feedback(Request $request){
        StValidator::make($request->all(),[
            'content'=>'required|string',
            'client' => 'required|string'
        ]);

        $user = Auth::user();

        if(!Feedback::create([
            'userId' => $user->id,
            'content' => $request['content'],
            'client' => $request['client'],
        ])){
            return ['error' => 'insert_fail'];
        }

        return ['error' => 0];
    }


    /**
     * 显示学生反馈
     */
    public function showFeedback(Request $request){
        StValidator::make($request->all(),[
            'offset'=>'required|integer',
            'limit'=>'required|integer',
        ]);

        $offset = $request['offset'];
        $limit = $request['limit'];

        $query = DB::table('feedback')
            ->leftJoin('users','feedback.userId','=','users.id')
            ->select('feedback.id','name','content','client','feedback.created_at')
            ->orderBy('feedback.created_at','desc');

        $response = ['error' => 0];

        $response['total'] = $query->count();
        $response['rows'] = $query->skip($offset)
            ->take($limit)
            ->get();

        return $response;
    }

    public function deleteFeedback(Request $request){
        StValidator::make($request->all(),[
            'feedbackId'=>'required|integer',
        ]);

        $res = DB::table('feedback')
            ->where('id',$request->feedbackId)
            ->delete();

        return [
            'error' => $res ? 0 : -1
        ];
    }

}
