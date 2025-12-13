<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::withCount('books')->get();
        return response()->json($authors);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:authors',
            'bio' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $author = Author::create($request->all());
        return response()->json($author, 201);
    }

    public function show(Author $author)
    {
        $author->load('books');
        return response()->json($author);
    }

    public function update(Request $request, Author $author)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:authors,email,' . $author->id,
            'bio' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $author->update($request->all());
        return response()->json($author);
    }

    public function destroy(Author $author)
    {
        $author->delete();
        return response()->json(['message' => 'Author deleted successfully']);
    }
}