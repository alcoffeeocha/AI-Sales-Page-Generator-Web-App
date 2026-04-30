<?php

namespace App\Services;

use App\Models\Generation;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GeneratedPagePreviewSession
{
    private const SESSION_KEY = 'generated_page_previews';

    public function slug(Request $request, string $pageName): string
    {
        $baseSlug = Str::slug($pageName) ?: Str::uuid()->toString();
        $slug = $baseSlug;
        $suffix = 2;

        while ($request->session()->has(self::SESSION_KEY.'.'.$slug)) {
            $slug = $baseSlug.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    public function put(Request $request, string $slug, Page $page, Generation $generation): void
    {
        $request->session()->put(self::SESSION_KEY.'.'.$slug, [
            'page' => $page->getAttributes(),
            'generation' => $generation->getAttributes(),
        ]);
    }

    public function page(Request $request, string $slug): ?Page
    {
        $preview = $this->preview($request, $slug);

        if (! is_array($preview['page'] ?? null)) {
            return null;
        }

        $page = new Page;
        $page->forceFill($preview['page']);

        return $page;
    }

    public function html(Request $request, string $slug): ?string
    {
        $preview = $this->preview($request, $slug);

        if (! is_array($preview['generation'] ?? null)) {
            return null;
        }

        return $preview['generation']['html'] ?? null;
    }

    /**
     * @return array{page?: array<string, mixed>, generation?: array<string, mixed>}
     */
    private function preview(Request $request, string $slug): array
    {
        $preview = $request->session()->get(self::SESSION_KEY.'.'.$slug);

        if (! is_array($preview)) {
            return [];
        }

        return $preview;
    }
}
