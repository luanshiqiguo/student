<?php

use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i=0;$i<50;$i++){
            DB::table('answers')->insert([
                'keyword'=>str_random(20),
                'answer'=>str_random(20),
                'views'=>rand(1,20),
            ]);
        }

    }
}
