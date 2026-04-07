<?php

use App\Http\Controllers\EntradaController;
use App\Http\Controllers\FileUploadController;
use Illuminate\Support\Facades\Route;

Route::get('/eventos' , [EntradaController::class , 'verProductos']);
Route::post('/upload', [FileUploadController::class, 'store']);
// Añadir los eventos
Route::post('/addEvento', [EntradaController::class, 'addEvento']);
// Recuperar las etiquetas
Route::get('/etiquetas', [EntradaController::class, 'getEtiquetas']);
// Gestión de recomendados
Route::post('/recomendados', [EntradaController::class, 'recomendadosPersonalizados']);