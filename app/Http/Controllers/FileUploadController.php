<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileUploadController
{
    //Lógica del controlador para subir archivos al servidor
    public function store(Request $request){
        // Validar que sea una imagen
        $request->validate([
            'archivo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if($request->hasFile('archivo')){
            // Para que se guarde en uploads
            $path = $request->file('archivo')->store('uploads', 'public');
            // Devolver ruta
            return response()->json([
                'message' => 'Archivo subido con éxito',
                'path' => '/storage/'.$path
            ], 200);
        }
        return response()->json(['message' => 'No se ha subido ningún archivo'], 400);
    }
}
