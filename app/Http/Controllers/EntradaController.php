<?php

namespace App\Http\Controllers;

use App\Models\Entrada;
use App\Models\Etiqueta;
use App\Models\Evento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EntradaController
{
    // Esta funcion unifica el formato de salida de un evento para reutilizarlo
    // tanto en el listado general como en los recomendados personalizados.
    private function transformarEvento($evento)
    {
        return [
            'id' => $evento->id,
            'nombre' => $evento->nombre,
            'fechaInicio' => $evento->fechaInicio,
            'fechaFin' => $evento->fechaFin,
            'aforo' => $evento->aforo,
            'localizacion' => $evento->localizacion,
            'descripcion' => $evento->descripcion,
            'imagen' => $evento->imagen,
            // La entrada asociada aporta el precio y el stock restante del evento.
            'precio' => $evento->entrada?->precio,
            'stock' => $evento->entrada?->cantidad ?? 0,
            // Las etiquetas se devuelven como un array simple de nombres.
            'etiquetas' => $evento->tags->pluck('nombreEtiqueta')->values(),
        ];
    }

    // Devuelve todos los eventos con sus datos principales, etiquetas y entrada asociada.
    public function verProductos()
    {
        $eventos = Evento::with(['tags:id,nombreEtiqueta', 'entrada:id,evento_id,precio,cantidad'])
            ->get()
            ->map(fn ($evento) => $this->transformarEvento($evento))
            ->values();

        return response()->json($eventos);
    }

    // Crea un evento nuevo junto con su entrada y sus etiquetas.
    public function addEvento(Request $request)
    {
        // Validamos los datos minimos antes de guardar nada en base de datos.
        $request->validate([
            'nombre' => 'required|string',
            'imagen' => 'required|image|max:2048',
            'precio' => 'required|numeric',
            'aforo' => 'required|integer',
            'etiquetas' => 'array',
            'etiquetas.*' => 'string'
        ]);

        // La transaccion evita dejar datos a medias si falla alguna parte del proceso.
        return DB::transaction(function () use ($request) {
            // La imagen se guarda en el disco publico de Laravel.
            $path = $request->file('imagen')->store('eventos', 'public');

            // Primero se crea el evento base.
            $evento = Evento::create([
                'nombre' => $request->nombre,
                'fechaInicio' => $request->fechaInicio,
                'fechaFin' => $request->fechaFin,
                'aforo' => $request->aforo,
                'localizacion' => $request->localizacion,
                'descripcion' => $request->descripcion,
                'imagen' => $path,
            ]);

            // Despues se crea su entrada asociada con precio y cantidad inicial.
            Entrada::create([
                'evento_id' => $evento->id,
                'precio' => $request->precio,
                'cantidad' => $request->aforo
            ]);

            // Si se han enviado etiquetas, se crean si no existen y se vinculan al evento.
            if ($request->has('etiquetas')) {
                $idsEtiquetas = [];

                foreach ($request->etiquetas as $nombre) {
                    $etiqueta = Etiqueta::firstOrCreate(
                        ['nombreEtiqueta' => trim(strtolower($nombre))]
                    );
                    $idsEtiquetas[] = $etiqueta->id;
                }

                $evento->tags()->sync($idsEtiquetas);
            }

            return response()->json(['message' => 'Evento generado con exito'], 201);
        });
    }

    // Elimina un evento y, si existe, tambien su imagen del almacenamiento.
    public function eliminarEvento($id)
    {
        // Si el id no existe, Laravel devuelve automaticamente un 404.
        $evento = Evento::findOrFail($id);

        return DB::transaction(function () use ($evento) {
            // Antes de borrar el registro se elimina la imagen fisica para no dejar archivos huerfanos.
            if ($evento->imagen && Storage::disk('public')->exists($evento->imagen)) {
                Storage::disk('public')->delete($evento->imagen);
            }

            // Al borrar el evento se aplican tambien los borrados en cascada definidos en la base de datos.
            $evento->delete();

            return response()->json(['message' => 'Evento eliminado con exito'], 200);
        });
    }

    // Devuelve todas las etiquetas disponibles en la base de datos.
    public function getEtiquetas()
    {
        return response()->json(Etiqueta::all(), 200);
    }

    // Genera recomendaciones en funcion de las etiquetas que el usuario tenga guardadas.
    public function recomendadosPersonalizados(Request $request)
    {
        $idsEtiquetas = $request->input('etiquetas', []);

        // Si el usuario no tiene preferencias, se muestran cuatro eventos aleatorios.
        if (empty($idsEtiquetas)) {
            $eventos = Evento::with(['tags:id,nombreEtiqueta', 'entrada:id,evento_id,precio,cantidad'])
                ->inRandomOrder()
                ->limit(4)
                ->get()
                ->map(fn ($evento) => $this->transformarEvento($evento))
                ->values();

            return response()->json($eventos);
        }

        // Si hay preferencias, solo se buscan eventos que compartan alguna de esas etiquetas.
        $eventos = Evento::with(['tags:id,nombreEtiqueta', 'entrada:id,evento_id,precio,cantidad'])
            ->whereHas('tags', function ($query) use ($idsEtiquetas) {
                $query->whereIn('etiquetas.id', $idsEtiquetas);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get()
            ->map(fn ($evento) => $this->transformarEvento($evento))
            ->values();

        return response()->json($eventos);
    }

    // Recupera varios eventos de una sola vez a partir de un conjunto de IDs.
    // Se usa para reconstruir el historial de compras del usuario.
    public function obtenerPorLote(Request $request)
    {
        $ids = $request->input('ids', []);

        // Si no llegan IDs, devolvemos un array vacio para evitar consultas innecesarias.
        if (empty($ids)) {
            return response()->json([]);
        }

        $eventos = Evento::whereIn('id', $ids)->get();

        return response()->json($eventos);
    }
}
