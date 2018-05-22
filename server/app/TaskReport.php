<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TaskReport extends Model
{

    protected $table = 'taskreport';

    protected $fillable = ['userId', 'taskId', 'content','score','time','experience','experienceScore'];

}
