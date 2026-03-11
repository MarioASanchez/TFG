<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;


class EntradaController
{
    function verProductos(){
        $pedidos = [];
        $pedidos = Evento::all();
        return response()->json($pedidos);
    }
}
