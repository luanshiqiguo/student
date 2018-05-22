<?php

namespace App\Http\Controllers;

use App\Common\StFetch;
use App\Common\StValidator;
use App\TaskBank;
use App\TaskScheduleMap;
use Carbon\Carbon;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use League\Flysystem\Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskBankController extends Controller
{
    public function getTaskListEx(Request $request){
        StValidator::make($request->all(), [
            'taskTypes' => 'array|required',
        ]);

        $user = Auth::user();
        $groupId = $user['groupId'];
        $userId = $user['id'];
        $taskTypes = $request['taskTypes'];

        $list = DB::table('taskbank')
            ->where('published',true)
            ->where('groupId',$groupId)
            ->where('startTime','<',Carbon::now())
            ->whereIn('type',$taskTypes)
            ->leftJoin('taskreport',function ($join) use($userId){
                $join->on('taskreport.taskId','=','id')
                    ->where('taskreport.userId','=',$userId);
            })
            ->select('id','title','target','week','startTime','deadLine','type','content','score','experience','experienceScore')
            ->get();

        $newList = [];
        foreach ($list as $item){
            $newItem = StFetch::toArray($item);
            $newItem['expire'] = $item->deadLine < Carbon::now();
            $newList[] = $newItem;
        }

        return[
            'error' => 0,
            'list' => $newList
        ];

    }

    public function getAllTasks(Request $request)
    {
        StValidator::make($request->all(),[
            'offset'=>'required|integer',
            'limit'=>'required|integer',
            'search'=>'string',
            'type'=>'array',
            'withFilter'=>'boolean'
        ]);

        $offset = $request['offset'];
        $limit = $request['limit'];
        $teacher = Auth::user();

        $query = DB::table('taskbank')
            ->select('id','title','target','week','groupId','published','type','startTime','deadLine','created_at','updated_at')
            ->where('creatorId',$teacher['id'])
            ->orderBy('updated_at','desc');

        if(isset($request['type'])){
            $query->whereIn('type',$request['type']);
        }

        if(isset($request['search']) && strlen($request['search']) > 0){
            $search = $request['search'];
            $query->where(function($q) use($search) {
                $q->orWhere('title','like',"%".$search."%")
                    ->orWhere('target','like',"%".$search."%");
            });
        }

        $response = ['error' => 0];

        if($request['withFilter']){
            $queryFilter = DB::table('taskbank')
                ->where('creatorId',$teacher['id']);

            $response['typeFilter'] = $queryFilter->select('type')->distinct()->orderBy('type','asc')->get();
        }

        $response['total'] = $query->count();
        $response['rows'] = $query->skip($offset)
            ->take($limit)
            ->get();

        return $response;

    }

    public function publishTask(Request $request)
    {
        StValidator::make($request->all(),[
            'taskId' => 'required|integer',
        ]);

        $teacher = Auth::user();
        $res = TaskBank::where('id',$request['taskId'])->where('creatorId',$teacher['id'])->update(['published'=>true]);
        if(!$res){
            return ['error' => 'db_update_fail'];
        }

        return ['error' => 0];
    }

    public function addTask(Request $request)
    {
        StValidator::make($request->all(),[
            'title' => 'required|string',
            'target' => 'required|string',
            'week' => 'required|integer',
            'type' => 'required|integer|in:1,2,3,4',
            'groupId' => 'required|string',
            'startTime' => 'required|string',
            'deadLine' => 'required|string',
            'questions' => 'array',
        ]);

        if($request['type'] != 4){
            if(!isset($request['questions']) || count($request['questions']) <= 0){
                return response()->json(['error' => 'bad_parameter'], 422);
            }
        }

        $teacherId = Auth::user()->id;

        if($request['type'] < 4){
            try{
                DB::beginTransaction();
                $task = TaskBank::create(
                    StFetch::fetch(
                        $request,
                        ['title','target','week','groupId','type','id','startTime','deadLine'],
                        ['published'=>false,'creatorId'=>$teacherId]
                    )
                );

                if(!$task){
                    throw new Exception('db_insert_fail');
                }

                $map = [];
                foreach($request['questions'] as $item){
                    $map[] = ['taskId'=>$task['id'],'questionId'=>$item];
                }
                if(!DB::table('taskquestionmap')->insert($map)){
                    throw new Exception('db_insert_fail');
                }

                DB::commit();
            }catch (Exception $e){
                DB::rollback();
                return ['error'=>$e->getMessage()];
            }

        } else {
            $task = TaskBank::create(
                StFetch::fetch(
                    $request,
                    ['title','target','week','groupId','type','id','startTime','deadLine'],
                    ['published'=>false,'creatorId'=>$teacherId]
                )
            );
            if(!$task){
                return ['error'=>'db_insert_fail'];
            }
        }

        return ['error'=>0,'taskId'=>$task['id']];
    }

    public function delTask(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'taskId' => 'required|integer',
        ]);

        if($validator->fails()){
            return response()->json(['error' => 'bad_parameter'], 401);
        }

        $teacher = Auth::user();

        $task = TaskBank::where('id', $request['taskId'])->where('creatorId',$teacher['id'])->select('published','type')->first();
        if(!$task){
            return ['error' => 'not_find_task'];
        }

        if($task['type'] == 4){
            if(!DB::table('taskbank')->where('id',$request['taskId'])->delete()){
                return ['error' => 'db_delete_fail'];
            }
        } else {
            try{
                DB::beginTransaction();
                if(!DB::table('taskbank')->where('id',$request['taskId'])->delete()){
                    throw new Exception('db_insert_fail');
                }
                if(!DB::table('taskquestionmap')->where('taskId',$request['taskId'])->delete()){
                    throw new Exception('db_insert_fail');
                }
                DB::commit();
            }catch(Exception $e){
                DB::rollback();
                return ['error' => $e->getMessage()];
            }
        }

        return ['error' => 0];
    }

    public function updateTask(Request $request)
    {
        StValidator::make($request->all(),[
            'taskId' => 'integer|required',
            'title' => 'string',
            'target' => 'string',
            'week' => 'integer',
            'type' => 'integer|in:1,2,3,4',
            'groupId' => 'string',
            'startTime' => 'string',
            'deadLine' => 'string',
        ]);

        if(!($request['type'] != 4 && count($request['questions']) > 0)){
            return response()->json(['error' => 'bad_parameter'], 422);
        }

        $teacher = Auth::user();

        $task = TaskBank::where('id' ,$request['taskId'])->where('creatorId',$teacher['id'])->first();
        if(!$task){
            return ['error' => 'not_find_task'];
        }

        //获取taskbank需要修改的字段
        $arr = ['title','target','week','type','groupId','startTime','deadLine'];
        $flag = false;//标志位，是否需要修改
        foreach($arr as $item){
            if(isset($request[$item])){
                $task[$item] = $request[$item];
                $flag = true;
            }
        }

        if(isset($request['questions'])){
            try{
                DB::beginTransaction();

                if(!DB::table('taskquestionmap')->where('taskId',$request['taskId'])->delete()){
                    throw new Exception('db_delete_fail');
                }

                $map = [];
                foreach($request['questions'] as $item){
                    $map[] = ['taskId'=>$task['id'],'questionId'=>$item];
                }
                if(!DB::table('taskquestionmap')->insert($map)){
                    throw new Exception('db_insert_fail');
                }

                //如果flag=true，保存task的变化
                if($flag && !$task->save()){
                    throw new Exception('db_update_fail');
                }

                DB::commit();
            }catch(Exception $e){
                DB::rollback();
                return ['error' => $e->getMessage()];
            }
        } else {
            if($flag && !$task->save()){
                return ['error'=>'db_update_fail'];
            }
        }

        return ['error' => 0];
    }

    public function getTaskQuestionIds(Request $request)
    {
        StValidator::make($request->all(),[
            'taskId' => 'integer|required',
        ]);

        $questionIds = DB::table('taskquestionmap')->where('taskId',$request['taskId'])->select('questionId')->get();

        return [
            'error' => 0,
            'questionIds' => $questionIds,
        ];
    }


    //老师查看task详情，时获取题目内容
    public function getTaskContentWithAnswer(Request $request){
        StValidator::make($request->all(),[
            'taskId' => 'required'
        ]);


        $taskId = $request->taskId;

        $content = DB::table('taskquestionmap')
            ->join('questionbank','taskquestionmap.questionId','=','questionbank.id')
            ->select('id','content','answers')
            ->where('taskId','=',$taskId)
            ->get();

        return [
            'error' => 0,
            'content' => $content
        ];
    }
}
