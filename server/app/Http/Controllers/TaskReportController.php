<?php

namespace App\Http\Controllers;

use App\Common\StFetch;
use App\Common\StValidator;
use App\TaskReport;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use League\Flysystem\Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class TaskReportController extends Controller
{
    //学生提交task
   public function addTaskReport(Request $request){

       StValidator::make($request->all(),[
           'taskId' => 'required',
           'content' => 'required',
           'type' => 'required',
           'time' => 'required',
       ]);

       $user = Auth::user();
       $userId = $user->id;
       $taskId = $request->taskId;
       $type = $request->type;
       $time = $request->time;
       $content = $request['content'];
       $score = null;
       $experience = $request->experience?$request->experience:null;

       if ($type != 4){
           $answers = DB::table('taskquestionmap')
               ->join('questionbank','taskquestionmap.questionId','=','questionbank.id')
               ->select('id','answers')
               ->where('taskId','=',$taskId)
               ->get();

           $stuAnswer = json_decode($content)->content;
           $score = 0;
           foreach ($answers as $item){
               if ($stuAnswer->{$item->id} == $item->answers){
                   $score++;
               }
           }
       }

       try{
           TaskReport::create([
               'taskId' => $taskId,
               'userId' => $userId,
               'content' => $content,
               'score' => $score,
               'experience' => $experience,
               'time' => $time,
           ]);
       } catch(Exception $ex) {
           return ['error' => 'db_insert_fail'];
       }

       return[
           'error' => 0,
           'score' => $score,
       ];

   }

    public function getAllReports(Request $request)
    {
        StValidator::make($request->all(),[
            'offset'=>'required|integer',
            'limit'=>'required|integer',
            'taskType' => 'integer',
            'search'=>'string',
            'week'=>'array',
            'withFilter'=>'boolean',
        ]);

        $teacher = Auth::user();

        $query = DB::table('taskreport')
            ->join('users',function($join) use($teacher){
                $join->on('users.id','=','taskreport.userId')
                    ->where('teacherId','=',$teacher['teacherId']);
            });

        if(isset($request['taskType'])){
            $taskType = $request['taskType'];
            $query->join('taskbank',function($join) use($taskType){
               $join->on('taskbank.id','=','taskreport.taskId')
                   ->where('taskbank.type','=',$taskType);
            });
        } else {
            $query->join('taskbank','taskbank.id','=','taskreport.taskId');
        }

        if(isset($request['week'])){
            $query->whereIn('week',$request['week']);
        }

        if($request['withFilter']){
            $response['weekFilter'] = DB::table('taskbank')
                ->where('creatorId',$teacher['id'])
                ->select('week')
                ->distinct()
                ->orderBy('week','asc')
                ->get();
        }

        //search
        if(isset($request['search']) && strlen($request['search']) > 0){
            $search = $request['search'];
            $query->where(function($q) use($search) {
                $q->orWhere('stuId','like',"%".$search."%")
                    ->orWhere('name','like',"%".$search."%");
            });
        }

        $query->select('taskreport.userId','taskreport.taskId','taskreport.content','taskreport.score','taskreport.time','taskreport.experience','taskreport.experienceScore',
                'taskreport.created_at as finishTime','taskbank.title','taskbank.week','taskbank.groupId',
                'taskbank.type','users.stuId','users.name','users.class')
            ->orderBy('taskreport.created_at','desc');


        $response['error'] = 0;
        $response['total'] = $query->count();
        $response['rows'] = $query->skip($request['offset'])
            ->take($request['limit'])
            ->get();

        return $response;

    }


    //给每周总结report评分 update-report-of-score
    public function updateReportOfScore(Request $request){
        StValidator::make($request->all(),[
            'score' => 'required|integer',
            'userId' => 'required|integer',
            'taskId' => 'required|integer'
        ]);

        $res = TaskReport::where('userId',$request['userId'])
            ->where('taskId',$request['taskId'])
            ->update([
                'score' => $request['score']
            ]);

        return[
            'error' => (!$res ? 'db_update_fail' : 0)
        ];
    }

    //给心得评分
    public function updateReportOfExperienceScore(Request $request){
        StValidator::make($request->all(),[
            'experienceScore' => 'required',
            'userId' => 'required',
            'taskId' => 'required'
        ]);

        $res = TaskReport::where('userId',$request['userId'])
            ->where('taskId',$request['taskId'])
            ->update([
                'experienceScore' => $request['experienceScore']
            ]);

        return[
            'error' => (!$res ? 'db_update_fail' : 0)
        ];
    }
}
