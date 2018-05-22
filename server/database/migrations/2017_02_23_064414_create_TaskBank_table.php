<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskBankTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taskbank', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('target');
            $table->integer('week');
            $table->string('groupId',32);
            $table->boolean('published')->default(false);
            $table->integer('type');
            $table->unsignedInteger('creatorId');
            $table->dateTime('startTime');
            $table->dateTime('deadLine');
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
        Schema::drop('taskbank');
    }
}
