<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentQuestionBanksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //创建
        Schema::create('studentquestionbank', function (Blueprint $table) {
            $table->increments('id');
            $table->text('questions');                  //存放问题
            $table->text('keyword');               //存放关键词
            $table->unsignedInteger('creatorId');     //提问的学生ID
            $table->timestamps();                             //记录创建时间和更新时间
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('studentquestionbank');
    }
}
