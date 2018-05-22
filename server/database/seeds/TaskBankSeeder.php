<?php

use Illuminate\Database\Seeder;

class TaskBankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $groupIdSet = ['2g' , '1c'];
        for ($type=1;$type<5;$type++){
            for ($week=1;$week<20;$week++){
                for ($groupId=1;$groupId<3;$groupId++){
                    factory('App\TaskBank')->create([
                        'type'=>$type,
                        'week'=>$week,
                        'groupId'=>$groupIdSet[$groupId-1],
                        'creatorId'=>9,
                    ]);
                }
            }
        }

    }
}
