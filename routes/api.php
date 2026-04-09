<?php

use App\Http\Controllers\EntradaController;
use App\Http\Controllers\FileUploadController;
use Illuminate\Support\Facades\Route;

Route::get('/eventos', [EntradaController::class, 'verProductos']);
Route::post('/upload', [FileUploadController::class, 'store']);
Route::post('/addEvento', [EntradaController::class, 'addEvento']);
Route::delete('/evento/{id}', [EntradaController::class, 'eliminarEvento']);
Route::get('/etiquetas', [EntradaController::class, 'getEtiquetas']);
Route::post('/recomendados', [EntradaController::class, 'recomendadosPersonalizados']);
Route::post('/eventos/lote', [EntradaController::class, 'obtenerPorLote']);
