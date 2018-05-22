<?php

use Illuminate\Database\Seeder;

class StudentQuestionBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
      public function run()
      {
          for ($i=0;$i<50;$i++){
              DB::table('studentquestionbanks')->insert([
                  'questions'=>str_random(20),
                  'keyword'=>str_random(20),
                  'creatorld'=>9,
              ]);
          }
      }
}
