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
    public function verProductos()
    {
        $eventos = Evento::with(['tags:id,nombreEtiqueta', 'entrada:id,evento_id,precio,cantidad'])
            ->get()
            ->map(function ($evento) {
                return [
                    'id' => $evento->id,
                    'nombre' => $evento->nombre,
                    'fechaInicio' => $evento->fechaInicio,
                    'fechaFin' => $evento->fechaFin,
                    'aforo' => $evento->aforo,
                    'localizacion' => $evento->localizacion,
                    'descripcion' => $evento->descripcion,
                    'imagen' => $evento->imagen,
                    'precio' => $evento->entrada?->precio,
                    'stock' => $evento->entrada?->cantidad ?? 0,
                    'etiquetas' => $evento->tags->pluck('nombreEtiqueta')->values(),
                ];
            })
            ->values();

        return response()->json($eventos);
    }

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

        return DB::transaction(function () use ($request) {
            $path = $request->file('imagen')->store('eventos', 'public');

            $evento = Evento::create([
                'nombre' => $request->nombre,
                'fechaInicio' => $request->fechaInicio,
                'fechaFin' => $request->fechaFin,
                'aforo' => $request->aforo,
                'localizacion' => $request->localizacion,
                'descripcion' => $request->descripcion,
                'imagen' => $path,
            ]);

            Entrada::create([
                'evento_id' => $evento->id,
                'precio' => $request->precio,
                'cantidad' => $request->aforo
            ]);

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

    public function eliminarEvento($id)
    {
        $evento = Evento::findOrFail($id);

        return DB::transaction(function () use ($evento) {
            if ($evento->imagen && Storage::disk('public')->exists($evento->imagen)) {
                Storage::disk('public')->delete($evento->imagen);
            }

            $evento->delete();

            return response()->json(['message' => 'Evento eliminado con exito'], 200);
        });
    }

    public function getEtiquetas()
    {
        return response()->json(Etiqueta::all(), 200);
    }

    public function recomendadosPersonalizados(Request $request)
    {
        $idsEtiquetas = $request->input('etiquetas', []);

        if (empty($idsEtiquetas)) {
            return response()->json(Evento::with('tags')->inRandomOrder()->limit(4)->get());
        }

        $eventos = Evento::with('tags')
            ->whereHas('tags', function ($query) use ($idsEtiquetas) {
                $query->whereIn('etiquetas.id', $idsEtiquetas);
            })
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return response()->json($eventos);
    }

    public function obtenerPorLote(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json([]);
        }

        $eventos = Evento::whereIn('id', $ids)->get();

        return response()->json($eventos);
    }
}
