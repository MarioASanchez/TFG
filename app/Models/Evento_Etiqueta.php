<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento_Etiqueta extends Model
{
    protected $fillable = [
        'evento_id',
        'etiqueta_id',

    ];
}
