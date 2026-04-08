<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Etiqueta;
use App\Models\Evento;
use Carbon\Carbon;
use Illuminate\Container\Attributes\Tag;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;


class EntradaController
{
    function verProductos()
    {
        $eventos = DB::table('eventos')
            ->join('entradas', 'eventos.id', '=', 'entradas.evento_id')
            ->select('eventos.*', 'entradas.precio', 'entradas.cantidad as stock')
            ->get();
        return response()->json($eventos);
    }

    // Función para añadir los Eventos
    public function addEvento(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'imagen' => 'required|image|max:2048',
            'precio' => 'required|numeric',
            'aforo' => 'required|integer',
            'etiquetas' => 'array',
            'etiquetas.*' => 'string'
        ]);

        // Transacción para evitar crear eventos sin entradas
        return DB::transaction(function () use ($request) {
            // Guardar la imagen
            $path = $request->file('imagen')->store('eventos', 'public');

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

    // Obtener todas las etiquetas de la BBDD de eventos
    public function getEtiquetas()
    {
        return response()->json(Etiqueta::all(), 200);
    }

    // Traer cuatro eventos aleatorios (con los ID recibidos) en función de los ID que hayamos obtenido del usuario
    public function recomendadosPersonalizados(Request $request)
    {
        // Buscamos 'etiquetas', que es lo que envías desde React
        $idsEtiquetas = $request->input('etiquetas', []);

        // 2. Si no hay preferencias, devuelve cuatro eventos aleatorios
        if (empty($idsEtiquetas)) {
            return response()->json(Evento::with('tags')->inRandomOrder()->limit(4)->get());
        }

        // 3. Filtrado 
        $eventos = Evento::with('tags')
            ->whereHas('tags', function ($query) use ($idsEtiquetas) {
                // Importante: Asegúrate que 'etiquetas.id' es el nombre real de tu tabla/columna
                $query->whereIn('etiquetas.id', $idsEtiquetas);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return response()->json($eventos);
    }

    // Extraer el historial de compras de cada usuario (da igual la fecha)
    public function obtenerPorLote(Request $request)
    {
        // Recibimos un array de IDs desde React
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json([]);
        }

        // Buscamos todos los eventos que coincidan con esos IDs
        $eventos = Evento::whereIn('id', $ids)->get();

        return response()->json($eventos);
    }

}
