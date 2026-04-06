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
        // Asumiendo que tu tabla pivote se llama event_tag
        return $this->belongsToMany(Etiqueta::class, 'evento__etiquetas', 'evento_id', 'etiqueta_id');
    }
}
