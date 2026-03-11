<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entrada extends Model
{
      protected $fillable = [
        'evento_id',
        'puntos',
        'precio'
    ];
}
