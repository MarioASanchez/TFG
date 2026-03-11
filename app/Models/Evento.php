<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
     protected $fillable = [
        'nombre',
        'fechaInicio',
        'fechaFin',
        'aforo',
        'localizacion',
        'descripcion',
        'imagen'
    ];
}
