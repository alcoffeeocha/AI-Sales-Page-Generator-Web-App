<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Models\Page;
use App\Services\GeneratedPagePreviewSession;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SalesPageController extends Controller
{
    public function __construct(private GeneratedPagePreviewSession $previewSession) {}

    /**
     * Display a sales page
     */
    public function show(Request $request, string $page): View
    {
        if ($request->boolean('preview')) {
            $html = $this->previewSession->html($request, $page);

            abort_if($html === null, 404);

            return view('page', [
                'html' => $html,
            ]);
        }

        $pageObject = Page::query()
            ->where('slug', $page)
            ->when(ctype_digit($page), fn ($query) => $query->orWhereKey($page))
            ->firstOrFail();

        $generation = Generation::query()
            ->where('page_id', $pageObject->id)
            ->firstOrFail();

        return view('page', [
            'html' => $generation->html,
        ]);
    }
}
