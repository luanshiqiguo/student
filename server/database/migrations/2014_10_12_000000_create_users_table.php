<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('stuId')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password', 60);
            $table->integer('privilege')->default(0);  //1 student 2 teacher
            $table->string('class',32);
            $table->string('groupId',32);
            $table->unsignedInteger('teacherId');
            $table->string('likes')->default(json_encode([]));
            $table->string('characters')->default(json_encode([]));
            $table->integer('basicKnowledge')->default(0);
            $table->string('random', 32);
            $table->rememberToken();
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
        Schema::drop('users');
    }
}
