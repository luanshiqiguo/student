<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuestionBank extends Model
{
    //
    protected $table = 'questionbank';

    protected $fillable = ['content', 'answers', 'creatorId'];
}
