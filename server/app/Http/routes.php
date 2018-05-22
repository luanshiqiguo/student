<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$api = app('Dingo\Api\Routing\Router');

/**
 * app接口
 */
$api->version('v1', ['middleware' => 'student'],function($api) {
    /**
     * 获取task列表和该用户相对应的作答情况，和用户的groupId有关
     * in:
     * [
     * //taskTypes是一个数组，目前支持1,2,3,4四种类型的任务（分别表示课前预习，课后作业，实验练习，章节总结）
     *  'taskTypes' => 'array|required'
     * ]
     *
     * out:
     * [
     * 'error' => 0,
     * //list中包含有taskbank和taskreport两个连表后的数据
     * 'list' => $list
     * ]
     */
    $api->post('/get-task-list-ex','App\Http\Controllers\TaskBankController@getTaskListEx');

    /**
     * 获取task的内容,从题库中获取对应题目和选项
     * in:
     * [
     * 'taskId' => 'required'
     * //withTask,返回的数据中是否带有对应的task信息
     * 'withTask' => 'bool'
     * ]
     *
     * out:
     * [
     * 'error' => 0,
     * 'questions' => $questions,
     * //根据withTask字段决定是否返回
     * 'task' => $task, ???
     * ]
     */
    $api->post('/get-task-content','App\Http\Controllers\QuestionBankController@getTaskContent');

    /**
     * 学生提交task，其中主要涉及到两类task，1）选择题类型，2）简答题类型
     *
     * in:
     * [
     * 'taskId' => 'required',
     * //content为将json转为字符串上传
     * //选择题格式,{题目id:选项...}
     * //简答题格式,{content:简答内容,score:自评分数}
     * 'content' => 'required',
     * //task类型
     * 'type' => 'required'
     * ]
     *
     * out:
     * [
     * 'error' => 0
     * //如果是简答题类型则不会返回分值，只有选择题类型的才会自动判断，给出分值
     * 'score' => $score
     * ]
     */
    $api->post('/add-task-report','App\Http\Controllers\TaskReportController@addTaskReport');
});

/**
 * 用户登录和token相关
 */
$api->version('v1',['middleware' => 'api.throttle', 'limit' => 50,'expires' => 1],function($api){
    /**
     * 刷新用户的token
     * in:
     * [
     * 'token'=>'required|string',
     * ]
     *
     * out:
     * [
     * 'error' => 0,
     * 'token' => $token,
     * ]
     */
    $api->post('/refresh','App\Http\Controllers\AuthenticateController@refresh');

    /**
     * 忘记密码时提交学号和邮箱，申请系统发送邮件
     */
    $api->post('/forget-password','App\Http\Controllers\AuthenticateController@forgetPassword');

    /**
     * 忘记邮箱时修改密码
     */
    $api->post('/reset-password','App\Http\Controllers\AuthenticateController@resetPassword');

    /**
     * 用户登录
     * in:
     * [
     * 'stuId'=>'required|string',
     * 'password'=>'required|string',
     * ]
     *
     * out:
     * [
     * 'error' => 0,
     * 'userInfo' => [
     * 'stuId' => $user['stuId'],
     * 'name' => $user['name'],
     * 'email' => $user['email'],
     * 'class' => $user['class'],
     * 'groupId' => $user['groupId'],
     * ],
     * 'token' => $token,
     * ]
     */
    $api->post('/sign-in','App\Http\Controllers\AuthenticateController@signIn');


    $api->post('/sign-in-of-teacher','App\Http\Controllers\AuthenticateController@signInOfTeacher');

    /**
     * 用户退出
     * in:
     * [
     * 'token'=>'required|string'
     * ]
     *
     * out:
     * [
     * 'error' => 0,
     * ]
     */
    $api->post('/sign-out','App\Http\Controllers\AuthenticateController@signOut');

//    $api->post('/feedback','App\Http\Controllers\FeedBackController@feedback');     //收集用户错误信息
});

/**
 * app接口，task相关 废弃
 */
$api->version('v1', ['middleware' => 'api.auth'],function($api){
	$api->get('/dingo',function(){
		return 'hello dingo';
	});
    $api->post('/dingo',function(){
        return 'hello dingo';
    });
});


$api->version('v1', ['middleware' => 'teacher'],function($api){

    $api->post('/init-views','App\Http\Controllers\Question_Answer\QuestionController@initViews');  //初始化answer查看次数
    $api->post('/get-all-users','App\Http\Controllers\UserController@getAllUsers');
    $api->post('/add-users','App\Http\Controllers\UserController@addUser');
    $api->post('/get-user-detail','App\Http\Controllers\UserController@getUserDetail');

    $api->post('/get-all-tasks','App\Http\Controllers\TaskBankController@getAllTasks');
    $api->post('/publish-task','App\Http\Controllers\TaskBankController@publishTask');
    $api->post('/add-task','App\Http\Controllers\TaskBankController@addTask');
    $api->post('/get-group-names','App\Http\Controllers\UserController@getGroupNames');
    $api->post('/del-task','App\Http\Controllers\TaskBankController@delTask');
    $api->post('/update-task','App\Http\Controllers\TaskBankController@updateTask');
    $api->post('/get-task-question-ids','App\Http\Controllers\TaskBankController@getTaskQuestionIds');
    $api->post('/get-task-content-with-answer','App\Http\Controllers\TaskBankController@getTaskContentWithAnswer');

    $api->post('/add-question','App\Http\Controllers\QuestionBankController@addQuestion');
    $api->post('/del-question','App\Http\Controllers\QuestionBankController@deleteQuestion');
    $api->post('/update-question','App\Http\Controllers\QuestionBankController@updateQuestion');
    $api->post('/get-all-questions','App\Http\Controllers\QuestionBankController@getAllQuestions');
    $api->post('/get-all-questions-for-select','App\Http\Controllers\QuestionBankController@getAllQuestionsForSelect');

    $api->post('/get-all-reports','App\Http\Controllers\TaskReportController@getAllReports');
    $api->post('/update-report-of-score','App\Http\Controllers\TaskReportController@updateReportOfScore');
    $api->post('/update-report-of-experienceScore','App\Http\Controllers\TaskReportController@updateReportOfExperienceScore');

    $api->post('/change-student-email','App\Http\Controllers\UserController@changestudentemail');
    $api->post('/get-feedback','App\Http\Controllers\FeedBackController@showFeedback');
    $api->post('/delete-feedback','App\Http\Controllers\FeedBackController@deleteFeedback');

});

/**
 * 用户相关的其他操作
 */
$api->version('v1',['middleware' =>'student' ],function($api){
    /**
     * 获取用户信息
     * in:
     * [
     * ]
     *
     * out:
     * [
     *    'error' => 0,
     *    'userInfo' => [
     *    'stuId' => $user['stuId'],
     *    'name' => $user['name'],
     *    'email' => $user['email'],
     *    'class' => $user['class'],
     *    'groupId' => $user['groupId'],
     *    ]
     * ];
     */
    $api->post('/user','App\Http\Controllers\AuthenticateController@user');
    $api->get('/user','App\Http\Controllers\AuthenticateController@user');

    /**
     * 修改密码
     * in:
     * [
     * 'srcPassword'=>'required|string',
     * 'newPassword'=>'required|string',
     * ]
     *
     * out:
     * [
     * 'error' => 0
     * ]
     */
    $api->post('/change-password','App\Http\Controllers\AuthenticateController@changePassword');

    /**
     * 修改邮箱
     */
    $api->post('/change-email','App\Http\Controllers\AuthenticateController@changeEmail');

    /**
     * 提交用户的意见反馈
     * in:
     * [
     * 'content'=>'required|string',
     * ]
     *
     * out:
     * [
     * 'error' => 0
     * ]
     */
    $api->post('/feedback','App\Http\Controllers\FeedBackController@feedback');

    /**
     * 修改个人信息
     * in:
     * [
     *  'data'=>data,
     *  'type'=>likes/characters/
     * ]
     *
     * out:
     * [
     * error=>0
     * ]
     */
    $api->post('update-stu-info','App\Http\Controllers\AuthenticateController@updateStuInfo');
});

$api->version('v1',function($api) {
    $api->get('/test', function () {
        return [
            'error'=>0,
            'message'=>'test success',
        ];
    });
});

/**
 * 问答系统操作
 */
$api->version('v1',['middleware' =>'student' ],function($api){
    /**
     * 获取问题信息
     * in:
     * [
     * 'question' =>'required|string'，
     * 'choice_keyword'=>'string'
     * ]
     *
     * out:
     * [
     *    'error' => 0,
     *    'answer'=>$answer,
     *
     * ];
     */
    $api->post('/question','App\Http\Controllers\Question_Answer\QuestionController@getAnswer');

    /**
     * 对用户的查询进行记录
     */
    $api->post('/recordQuery','App\Http\Controllers\Question_Answer\QuestionController@recordQuery');

    /**
     * 获取常见问题
     * in:
     * [
     *
     * ]
     * out
     * [
     *    'error'=>0',
     *    'list'=>$list,
     * ];
     */
    $api->post('/commonQuestion','App\Http\Controllers\Question_Answer\QuestionController@getCommonQuestion');

    /**
     * 获取该生的历史问题History
     * in:
     * [
     *
     * ]
     * out
     * [
     *     'error'=>'0'
     *     'list'=>$list'
     * ]
     */
    $api->post('/historyQuestion','App\Http\Controllers\Question_Answer\QuestionController@getHistoryQuestion');
});

/*
 *老师端对问答系统的操作
 */
//$api->version('v1',['middleware' =>'teacher' ],function($api){
    /*
     * 老师对问题记录表的查询，分班别，班别里面的学生按照学号的大小排序
     *  in:
     * [
     *    'class'=>'scx' //x等于1，2，3，4，5
     * ]
     * out
     * [
     *    'error'=>0',
     *    'list'=>$list,
     * ];
     */
//    $api->post('/teacherCheck','App\Http\Controllers\Question_Answer\QuestionController@getClassInformation');
//});
