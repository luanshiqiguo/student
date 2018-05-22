<?php

namespace App\Http\Controllers;

use App\Common\StFetch;
use App\Common\StValidator;
use App\QuestionBank;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class QuestionBankController extends Controller
{

    //添加题目到题库
    public function addQuestion(Request $request){

        StValidator::make($request->all(),[
            'content' => 'required',
            'answers' => 'required'
        ]);

        $user = Auth::user();

        $res = QuestionBank::create([
            'content' => $request['content'],
            'answers' => $request['answers'],
            'creatorId' => $user->id
        ]);

        if (!$res){
            return[
                'error' => 'db_insert_fail'
            ];
        }

        return [
            'error' => 0,
            'id' => $res['id'],
            'name' => $user->name,
            'created_at' => $res['created_at']->toDateTimeString()
        ];
    }

    //删除问题
    public function deleteQuestion(Request $request){
        StValidator::make($request->all(),[
            'questionId' => 'required'
        ]);

        $taskQuestionMap = DB::table('taskquestionmap')
            ->where('questionId','=',$request['questionId'])
            ->get();

        if(count($taskQuestionMap) > 0){
            return['error' => 'db_cannot_delete'];
        }else{
            $res = DB::table('questionbank')
                ->where('id','=',$request['questionId'])
                ->delete();

            return[
               'error' => (!$res ? 'db_delete_fail' : 0)
            ];
        }
    }

    //修改题目
    public function updateQuestion(Request $request){

        StValidator::make($request->all(),[
            'questionId' => 'required',
            'content' => 'required',
            'answers' => 'required'
        ]);

        $res = QuestionBank::where('id','=',$request['questionId'])
            ->update([
            'content' => $request['content'],
            'answers' => $request['answers']
        ]);

        return [
            'error' => (!$res ? 'db_update_fail' : 0)
        ];
    }

    //获取所有问题的列表
    public function getAllQuestionsForSelect(Request $request){

        StValidator::make($request->all(), [
            'offset'=>'required|integer',
            'limit'=>'required|integer',
            'search'=>'string',
        ]);

        $query = DB::table('questionbank')
            ->leftJoin('users','questionbank.creatorId','=','users.id')
            ->orderBy('questionbank.created_at','desc')
            ->select('questionbank.id','questionbank.content','questionbank.answers','questionbank.created_at','questionbank.updated_at','users.name','questionbank.creatorId');

        if(isset($request['search']) && strlen($request['search']) > 0){
            $search = $request['search'];
            $query->where(function($q) use($search) {
                $q->orWhere('questionbank.content','like',"%".$search."%")
                    ->orWhere('questionbank.id','=',$search);
            });
        }

        $num = $query->count();

        $questions = $query->skip($request['offset'])
            ->take($request['limit'])
            ->get();

        return[
            'error' => 0,
            'total' => $num,
            'rows' => $questions
        ];
    }

    //获取所有问题的列表
    public function getAllQuestions(Request $request){

        StValidator::make($request->all(), [
            'offset'=>'required|integer',
            'limit'=>'required|integer',
            'search'=>'string',
        ]);

        $query = DB::table('questionbank')
            ->orderBy('questionbank.created_at','desc')
            ->join('users','users.id','=','questionbank.creatorId')
            ->select('questionbank.id','content','answers','name','questionbank.created_at','questionbank.updated_at');

        if(isset($request['search']) && strlen($request['search']) > 0){
            $search = $request['search'];
            $query->where('content','like',"%".$search."%");
        }

        $num = $query->count();

        $questions = $query->skip($request['offset'])
            ->take($request['limit'])
            ->get();

        return[
            'error' => 0,
            'total' => $num,
            'rows' => $questions
        ];
    }

    //学生答题时获取题目内容
    public function getTaskContent(Request $request){
        StValidator::make($request->all(),[
            'taskId' => 'integer|required',
            'withTask' => 'bool'
        ]);

        $taskId = $request->taskId;
        $user = Auth::user();
        $userId = $user['id'];
        $groupId = $user['groupId'];

        $task = DB::table('taskbank')
            ->where('id',$taskId)
            ->first();

        $deadline = DB::table('taskbank')
            ->where('week',$task->week)
            ->where('type',$task->type)
            ->where('creatorId',$task->creatorId)
            ->max('deadLine');

        $response = [
            'error' => 0,
        ];

        if($deadline < Carbon::now()){
            $questions = DB::table('taskquestionmap')
                ->join('questionbank','taskquestionmap.questionId','=','questionbank.id')
                ->select('id','content','answers')
                ->where('taskId','=',$taskId)
                ->get();
        }else{
            $questions = DB::table('taskquestionmap')
                ->join('questionbank','taskquestionmap.questionId','=','questionbank.id')
                ->select('id','content')
                ->where('taskId','=',$taskId)
                ->get();

            $response['publicAnswerTime'] = $deadline;
        }

        $response['questions'] = $questions;

        if(isset($request['withTask'])){

            $task = DB::table('taskbank')
                ->where('published',true)
                ->where('groupId',$groupId)
                ->where('id',$taskId)
                ->leftJoin('taskreport',function ($join) use($userId){
                    $join->on('taskreport.taskId','=','id')
                        ->where('taskreport.userId','=',$userId);
                })
                ->select('id','title','target','week','startTime','deadLine','type','content','score','experience','experienceScore')
                ->first();

            if(!$task){
                return ['error' => 'not_find_task'];
            }

            $taskCopy = StFetch::toArray($task);
            $taskCopy['expire'] = $task->deadLine < Carbon::now();
            $response['task'] = $taskCopy;
        }

        return $response;
   }
}
