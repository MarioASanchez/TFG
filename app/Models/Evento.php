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

    public function tags()
    {
        return $this->belongsToMany(Etiqueta::class, 'evento__etiquetas', 'evento_id', 'etiqueta_id');
    }

    public function entrada()
    {
        return $this->hasOne(Entrada::class, 'evento_id');
    }
}
