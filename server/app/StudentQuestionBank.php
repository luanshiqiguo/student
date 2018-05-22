<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StudentQuestionBank extends Model
{
    //
    protected $table = 'studentquestionbank';

    protected $fillable = ['questions', 'keyword', 'creatorId'];

}
