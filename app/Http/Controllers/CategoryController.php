<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);

        $response = Http::get(url('/api/categories'), [
            'perPage' => $perPage
        ]);
        if (!$response->ok()) {
            // Opcional: redirige o muestra una vista de error
            return Inertia::render('Categories/Index', [
                'categories' => [],
                'error' => 'No se pudieron cargar las categorías.'
            ]);
        }

        $categories = $response->json('datos');
            return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    public function show($id)
    {
        $response = Http::get(url("/api/categories/{$id}"));

        if (!$response->ok()) {
            // Opcional: redirige o muestra una vista de error
            return Inertia::render('Categories/Show', [
                'category' => null,
                'error' => 'Categoría no encontrada.'
            ]);
        }

        $category = $response->json('datos');
        return Inertia::render('Categories/Show', [
            'category' => $category
        ]);
    }
}
