<?php

use App\Http\Controllers\EntradaController;
use Illuminate\Support\Facades\Route;

Route::get('/eventos' , [EntradaController::class , 'verProductos']);