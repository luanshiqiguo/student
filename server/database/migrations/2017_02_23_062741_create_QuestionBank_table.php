<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestionBankTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('questionbank', function (Blueprint $table) {
            $table->increments('id');
            $table->text('content');        //存放题目和选项
            $table->integer('answers');      //正确答案
            $table->unsignedInteger('creatorId');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::drop('questionbank');
    }
}
