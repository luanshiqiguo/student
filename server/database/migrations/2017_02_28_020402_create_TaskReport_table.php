<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskReportTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('taskreport', function (Blueprint $table) {
            $table->unsignedInteger('userId');
            $table->unsignedInteger('taskId');
            $table->text('content');
            $table->integer('score')->nullable();
            $table->text('experience')->nullable();
            $table->integer('experienceScore')->nullable();
            $table->integer('time');
            $table->timestamps();
            $table->primary(['userId','taskId']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('taskreport');
    }
}
