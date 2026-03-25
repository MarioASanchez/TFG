<?php

use App\Http\Controllers\EntradaController;
use App\Http\Controllers\FileUploadController;
use Illuminate\Support\Facades\Route;

Route::get('/eventos' , [EntradaController::class , 'verProductos']);
Route::post('/upload', [FileUploadController::class, 'store']);
// Añadir los eventos
Route::post('/addEvento', [EntradaController::class, 'addEvento']);