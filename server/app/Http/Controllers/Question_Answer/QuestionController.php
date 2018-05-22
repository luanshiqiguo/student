<?php

namespace App\Http\Controllers\Question_Answer;


use App\Common\StFetch;
use App\Common\StValidator;
use App\Answer;
use App\StudentQuestionBank;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use League\Flysystem\Exception;
use function PHPSTORM_META\type;
use Tymon\JWTAuth\Facades\JWTAuth;
use ZMQ;
use ZMQContext;
use ZMQSocket;


class QuestionController extends Controller
{
    /**
     *记录用户浏览记录在问题表中
     */
    public function recordQuery(Request $request){
        StValidator::make($request->all(),[
            'question' => 'string|required',
            'choice_keyword' => 'string|required',
        ]);

        $question = $request['question'];
        $choice_keyword = $request['choice_keyword'];

        $res = true;

        //关键词访问记录加1
        if($choice_keyword !== 'noAnswer'){
            $res = DB::table('answers')
                ->where('keyword', $choice_keyword)
                ->increment('views');
        }

        // 将用户提出的问题记录在问题记录表studentbuestionbank
        $user = Auth::user();
        $res2 = StudentQuestionBank::create([
            'questions' => $question,
            'keyword' => $choice_keyword,
            'creatorId' => $user->id
        ]);

        if(!$res){
            return[
                'error' => -2,
                'des' => '该关键词查询记录失败'
            ];
        }

        if (!$res2){
            return[
                'error' => -2,
                'des' => '用户查询记录失败'
            ];
        }

        return[
            'error' => 0,
            'creatorId' => $user->stuId
        ];
    }


    /**
     * 向结巴传递接收到的数据并且分词处理 此功能目前未能实现
     * 第一段是用来实验链接
     */
    function participle($question)
    {
        $context = new ZMQContext ();
        $requester = new ZMQSocket ($context, ZMQ::SOCKET_REQ);
        $requester->connect("tcp://localhost:5555");
        $requester->send($question);
        // 接受从jieba回来的分词结果
        $reply = $requester->recv();
        $rep = json_decode($reply);
        return $rep;
    }
    //模糊匹配的测试

    /**
     * @param Request $request
     * @return array
     */
    public function getAnswer(Request $request)
    {
        StValidator::make($request->all(), [
            'question' => 'string|required',    //用户提交的问题
        ]);

        $que = $request['question'];            //前台传过来的问题

        $user = Auth::user();                   //记录问题
        StudentQuestionBank::create([
            'questions' => $que,
            'keyword' => '历史查询问题',
            'creatorId' => $user->id
        ]);

        $key = $this->participle($que);         //分词得到的结果

        //如果分词的结果为零的话，返回error=-2
        if (!count($key)) {
            return [
                'error' => -2,
            ];
        }

        //分词结果不为零，匹配数据库
        $query = DB::table('answers')
            ->select('keyword', 'answer');

        //查询可以匹配所有关键词的答案
        for ($i = 0; $i < count($key); $i++) {
            $search = $key[$i];
            $query->where('keyword', 'like', "%" . $search . "%");
        }
        // orderBy('views','desc')只在orderBy('keyword')相同的情况下才会有作用，由此可见数据库还是有相似度这一说法
        $result = $query
            ->orderBy('keyword')
            ->orderBy('views', 'desc')
            ->get();

        //当分词结果中的每个单词都出现在一条keyword时才调用，将信息打包返回前台
        if (count($result)) {
            $number = count($result);
            $number = $number < 3 ? $number :3;
            $list = array($number);
            for ($i = 0; $i < $number; $i++) {
                //设计符合要求的答案并且将其返回给前台
                $list[$i] =
                    array(
                        'keyword' => $result[$i]->keyword,
                        'answer' => $result[$i]->answer,
                    );
            }
            return [
                'error' => 0,
                'answer' => $list,
            ];
        }

        $que = DB::table('answers')
            ->select('keyword', 'answer');

        //查询匹配单个关键词的答案（待改善）
        if (!count($result)) {
            for ($i = 0; $i < count($key); $i++) {
                $search = $key[$i];
                $que->where('keyword', 'like', "%" . $search . "%");
                $result = $que
                    ->orderBy('keyword')
                    ->orderBy('views', 'desc')
                    ->get();
                if (count($result)) {
                    $number = count($result);
                    $list = array($number);
                    for ($i = 0; $i < $number && $i < 5; $i++) {
                        //设计符合要求的答案并且将其返回给前台
                        $list[$i] = array(
                                'keyword' => $result[$i]->keyword,
                                'answer' => $result[$i]->answer,
                            );
                    }
                    return [
                        'error' => 0,
                        'answer' => $list,
                    ];
                }
            }
            return [
                'error' => -2,
            ];
        }

    }

    /**
     * 查询常见问题
     */
    public function getCommonQuestion()
    {
        $questions = DB::table('answers')
            ->orderBy('views','desc')
            ->having('views','>',0)
            ->get();

        $number = count($questions);
        $number = $number<10 ? $number:10;  //取前10个
        $list = [];
        for ($i = 0; $i < $number; $i++) {
            //返回符合要求的前十名并且给前台
            $list[$i] =
                array(
                    'keyword' => $questions[$i]->keyword,
                    'answer' => $questions[$i]->answer,
                );
        }
         return[
             'error' => 0,
             'list' => $list,
         ];


    }

    /**
     * @return array
     * 根据学生的stuId来匹配问题记录库
     */
    public function getHistoryQuestion(){

        $user = Auth::user();

        $history = DB::table('studentquestionbank')
            ->where('creatorId',$user->id)
            ->select('keyword','created_at')
            ->get();

        return [
            'error' => 0,
            'questions'=> $history,
        ];
    }

    public function initViews(){
        $res = DB::table('answers')
            ->where('views','>',0)
            ->update(['views' => 0]);

        return [
            'error' => $res? 0 : -2
        ];
    }

//    public function getClassInformation(Request $request){
//        StValidator::make($request->all(), [
//            'class' => 'string|required',
//        ]);
//
//        $class = DB::table('studentquestionbank')
//            ->where('class',$request->class)
//            ->get();
//    }
}
