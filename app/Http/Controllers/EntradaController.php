<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Etiqueta;
use App\Models\Evento;
use Illuminate\Container\Attributes\Tag;
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
            'aforo' => 'required|integer',
            'etiquetas' => 'array',
            'etiquetas.*' => 'string'
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


            // Crear las etiquetas
            if ($request->has('etiquetas')) {
            $tagIds = [];

            foreach ($request->etiquetas as $nombre) {
                // Si no existe, crea la etiqueta
                // trim() y strtolower() para evitar duplicados por espacios o mayúsculas
                $tag = Etiqueta::firstOrCreate(
                    ['nombreEtiqueta' => trim(strtolower($nombre))]
                );
                $tagIds[] = $tag->id;
            }

            $evento->tags()->sync($tagIds);
        } 

            return response()->json(['message' => 'Evento generado con éxito'], 201);
        });

     

        
    }



}
