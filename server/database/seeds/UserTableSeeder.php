<?php

use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $startId = 100;

        for($i=0;$i<20;$i++){
            $class=rand(1,5);
            if($i == 8){
                factory('App\User')->create([
                    'stuId'=>$startId+$i,
                    'password'=>bcrypt(666),
                    'class'=>'sc'.$class,
                    'privilege'=>2,
                    'teacherId'=>9,
                    'groupId'=>$class > 3 ? '2g' : '1c',
                    'email'=>'123@qq.com',
                ]);
            } else {
                factory('App\User')->create([
                    'stuId'=>$startId+$i,
                    'password'=>bcrypt(666),
                    'class'=>'sc'.$class,
                    'privilege'=>1,
                    'teacherId'=>9,
                    'groupId'=>$class > 3 ? '2g' : '1c',
                ]);
            }
        }

    }
}
