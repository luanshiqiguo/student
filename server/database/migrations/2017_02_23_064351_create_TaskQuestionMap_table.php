<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTaskQuestionMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('taskquestionmap', function (Blueprint $table) {
            $table->unsignedInteger('taskId');
            $table->unsignedInteger('questionId');
            $table->primary(['taskId','questionId']);
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
        Schema::drop('taskquestionmap');
    }
}
