<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskBank extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'taskbank';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'target', 'week','groupId','publish','type','creatorId'
        ,'startTime','deadLine'];


    public function taskSchedule(){
        return $this->hasMany('App\TaskScheduleMap','taskId');
    }
}
