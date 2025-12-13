<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with(['author', 'category'])->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|unique:books',
            'description' => 'nullable|string',
            'published_year' => 'required|integer|min:1000|max:' . date('Y'),
            'pages' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'author_id' => 'required|exists:authors,id',
            'category_id' => 'required|exists:categories,id',
        ]);

        $book = Book::create($request->all());
        return response()->json($book->load(['author', 'category']), 201);
    }

    public function show(Book $book)
    {
        return response()->json($book->load(['author', 'category']));
    }

    public function update(Request $request, Book $book)
    {
        $request->validate([
            'title' => 'string|max:255',
            'isbn' => 'string|unique:books,isbn,' . $book->id,
            'description' => 'nullable|string',
            'published_year' => 'integer|min:1000|max:' . date('Y'),
            'pages' => 'integer|min:1',
            'price' => 'numeric|min:0',
            'author_id' => 'exists:authors,id',
            'category_id' => 'exists:categories,id',
        ]);

        $book->update($request->all());
        return response()->json($book->load(['author', 'category']));
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(['message' => 'Book deleted successfully']);
    }
}