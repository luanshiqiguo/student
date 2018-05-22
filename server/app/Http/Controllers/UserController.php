<?php

namespace App\Http\Controllers;

use App\Common\StValidator;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
   public function getAllUsers(Request $request)
   {
       StValidator::make($request->all(),[
           'offset'=>'required|integer',
           'limit'=>'required|integer',
           'search'=>'string',
           'class'=>'array',
           'groupId'=>'array',
           'withFilter'=>'boolean',
       ]);

       $offset = $request['offset'];
       $limit = $request['limit'];
       $teacher = Auth::user();

       $query = DB::table('users')
           ->select('id','stuId','name','email','privilege','class','groupId')
           ->where('teacherId',$teacher['id'])
           ->where('privilege','<',2)
           ->orderBy('id','asc');

       if(isset($request['class'])){
           $query->whereIn('class',$request['class']);
       }

       if(isset($request['groupId'])){
           $query->whereIn('groupId',$request['groupId']);
       }

       $response = ['error' => 0];

       if($request['withFilter']){
           $queryFilter = DB::table('users')
               ->where('teacherId',$teacher['id'])
               ->where('privilege','<',2);

           $response['classFilter'] = $queryFilter->select('class')->distinct()->orderBy('class','asc')->get();

           $response['groupFilter'] = $queryFilter->select('groupId')->distinct()->orderBy('groupId','asc')->get();
       }

       if(isset($request['search']) && strlen($request['search']) > 0){
           $search = $request['search'];
           $query->where(function($q) use($search) {
              $q->orWhere('stuId','like',"%".$search."%")
                  ->orWhere('name','like',"%".$search."%");
           });
       }

       $response['total'] = $query->count();
       $response['rows'] = $query->skip($offset)
           ->take($limit)
           ->get();

       return $response;
   }

    public function getUserDetail(Request $request)
    {
        StValidator::make($request->all(),[
            'stuId' => 'required_without:id|integer',
            'id' => 'required_without:stuId|integer',
        ]);

        $teacher = Auth::user();

        $query = DB::table('users')
            ->select('id','stuId','name','email','privilege','class','groupId')
            ->where('teacherId',$teacher['id']);

        if(isset($request['stuId'])){
            $query->where('stuId',$request['stuId']);
        } else {
            $query->where('id',$request['id']);
        }

        $user = $query->first();

        if(!$user){
            return ['error' => 'not_find_the_user'];
        }

        $tasks = DB::table('taskbank')
            ->leftJoin('taskreport',function($join) use($user){
                $join->on('taskbank.id','=','taskreport.taskId')
                    ->where('taskreport.userId','=',$user->id);
            })
            ->where('groupId',$user->groupId)
            ->select('taskreport.score','taskreport.content','taskreport.created_at as finishTime','taskbank.id',
                'title','week','type','target','deadLine','time','experience','experienceScore')
            ->orderBy('taskbank.startTime','desc')
            ->get();

        return [
            'error' => 0,
            'userInfo' => $user,
            'tasks' => $tasks,
        ];
    }

    public function getGroupNames(){

        $teacher = Auth::user();

        $groupIdList = DB::table('users')
            ->where('teacherId',$teacher->id)
            ->select('groupId')
            ->distinct()
            ->get();

        if (!$groupIdList){
            return[
                'error' => 'db_error',
            ];
        }else{
            return[
                'error' => 0,
                'groupIdList' => $groupIdList
            ];
        }
    }

    public function changestudentemail(Request $request){
        StValidator::make($request->all(),[
            'keyword' => 'required',
            'stuId' => 'required',
            'email' => 'required|email|unique:users,email',
        ]);

        if($request->keyword != '521330mys##@@'){
            return ['error' => -1,'des'=>'口令错误'];
        }

        $res = DB::table('users')
            ->where('stuId',$request->stuId)
            ->update([
                'email' => $request->email
            ]);

        if(!$res){
            return ['error'=> -2];
        }

        return ['error' => 0];
    }

    public function addUser(Request $request){
        StValidator::make($request->all(),[
            'stuId' => 'required|unique:users,stuId',
            'name' => 'required',
            'class' => 'required',
            'groupId' => 'required',
        ]);

        $id = DB::table('users')
            ->insertGetId([
                'stuId' => $request->stuId,
                'name' => $request->name,
                'password' => bcrypt(123456),
                'privilege' => 1,
                'class' => $request->class,
                'groupId' => $request->groupId,
                'teacherId' => 189,
                'random' => str_random(32),
            ]);

        if(!$id){
            return [
                'error' => -2,
            ];
        }

        return [
            'error' => 0,
            'id' => $id,
        ];
    }
}





















