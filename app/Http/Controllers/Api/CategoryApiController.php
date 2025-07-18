<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class CategoryApiController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('perPage', 10);
        $categories = Category::paginate($perPage);

        if ($categories->isEmpty()) {
            return response()->json([
                'exito' => false,
                'mensaje' => 'No se encontraron categorías.',
                'datos' => []
            ], 404);
        }

        return response()->json([
            'exito' => true,
            'mensaje' => 'Categorías obtenidas correctamente.',
            'datos' => $categories
        ]);
    }

public function show($id)
{
    try {
        $category = Category::findOrFail($id);
        return response()->json([
            'exito' => true,
            'mensaje' => 'Categoría obtenida correctamente.',
            'datos' => $category
        ]);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'exito' => false,
            'mensaje' => 'Categoría no encontrada.',
            'datos' => []
        ], 404);
    }
}

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:300'
        ]);

        $category = Category::create($request->all());
        return response()->json([
            'exito' => true,
            'mensaje' => 'Categoría creada exitosamente.',
            'datos' => $category
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:50',
            'description' => 'nullable|string|max:300'
        ]);

        $category->update($request->all());
        return response()->json([
            'exito' => true,
            'mensaje' => 'Categoría actualizada exitosamente.',
            'datos' => $category
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json([
            'exito' => true,
            'mensaje' => 'Categoría eliminada exitosamente.'
        ], 204);
    }
}
