<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnswersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(/**
         * @param Blueprint $table
         */
            'answers', function(Blueprint $table)
        {
            #keyword存放的是jieba返回的关键词
            #content：Markdown格式文本
            #views纪录用户访问记录
            $table->string('keyword');
            $table->longText('answer');
            $table->unsignedInteger('views');
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.s
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('answers');

    }
}
