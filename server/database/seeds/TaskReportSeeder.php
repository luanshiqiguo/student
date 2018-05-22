<?php

use Illuminate\Database\Seeder;

class TaskReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $startId = 1;

        for($i=0;$i<12;$i++){
            factory('App\TaskReport')->create([
                'content' => json_encode(['content'=>["1"=>1,"2"=>1,"3"=>1,"4"=>1,"5"=>1],'randomStartLoc'=>7]),
                'userId' => $startId+$i,
                'score' => 2,
                'experience' => '这是心得体会',
                'experienceScore' => 5,
                'time' => 320,
                'taskId' => 1,
            ]);
        }

        for($i=0;$i<12;$i++){
            factory('App\TaskReport')->create([
                'content' => json_encode(['content'=>["41"=>1,"42"=>1,"43"=>1,"44"=>1,"45"=>1],'randomStartLoc'=>7]),
                'userId' => $startId+$i,
                'score' => 3,
                'experience' => '这是心得体会',
                'experienceScore' => 5,
                'time' => 120,
                'taskId' => 9,
            ]);
        }

        for($i=0;$i<12;$i++){
            factory('App\TaskReport')->create([
                'content' => json_encode(['content'=>["81"=>1,"82"=>1,"83"=>1,"84"=>1,"85"=>1],'randomStartLoc'=>7]),
                'userId' => $startId+$i,
                'score' => 4,
                'experience' => '这是心得体会',
                'experienceScore' => 5,
                'time' => 40,
                'taskId' => 17,
            ]);
        }

        for($i=0;$i<12;$i++){
            factory('App\TaskReport')->create([
                'userId' => $startId+$i,
                'content' => '{"content":"哈哈哈哈哈哈哈哈","score":3}',
                'time' => 299,
                'taskId' => 31,
            ]);
        }
    }
}
