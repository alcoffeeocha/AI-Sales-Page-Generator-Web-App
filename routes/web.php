<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SalesPageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::post('generate-html', [HomeController::class, 'create'])->name('generate-html');
    Route::get('page/{page}', [SalesPageController::class, 'show'])->name('page');
    Route::get('preview/{page}', [HomeController::class, 'preview'])->name('preview');
});

require __DIR__.'/auth.php';
