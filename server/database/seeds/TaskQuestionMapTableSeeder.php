<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskQuestionMapTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $questionId = 1;
        for ($taskId=1;$taskId<115;$taskId++){
            for ($i=0;$i<5;$i++,$questionId++){
                DB::table('taskquestionmap')->insert([
                    'taskId' => $taskId,
                    'questionId' => $questionId,
                ]);
            }
        }
    }
}
