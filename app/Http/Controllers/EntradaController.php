<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Evento;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


class EntradaController
{
    function verProductos(){
        $eventos = DB::table('eventos')
            ->join('entradas', 'eventos.id', '=', 'entradas.evento_id')
            ->select('eventos.*', 'entradas.precio', 'entradas.cantidad as stock')
            ->get();
        return response()->json($eventos);
    }

    // Función para añadir los Eventos
    public function addEvento(Request $request){
        $request->validate([
            'nombre' => 'required|string',
            'imagen' => 'required|image|max:2048',
            'precio' => 'required|numeric',
            'aforo' => 'required|integer'
        ]);

        // Transacción para evitar eventos sin entradas
        return DB::transaction(function () use ($request){
            // Guardar la imagen
            $path = $request->file('imagen')->store('eventos','public');

            // Crear el evento
            $evento = Evento::create([
                'nombre' => $request->nombre,
                'fechaInicio' => $request->fechaInicio,
                'fechaFin' => $request->fechaFin,
                'aforo' => $request->aforo,
                'localizacion' => $request->localizacion,
                'descripcion' => $request->descripcion,
                'imagen' => $path,
            ]);

            // Crear la entrada a partir del evento

            $entrada = Entrada::create([
                'evento_id' => $evento->id,
                'precio' => $request->precio,
                'cantidad' => $request->aforo
            ]);
            return response()->json(['message' => 'Evento generado con éxito'], 201);
        });

     

        
    }



}
