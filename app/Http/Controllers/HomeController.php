<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Models\Page;
use App\Services\GeneratedPagePreviewSession;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(private GeneratedPagePreviewSession $previewSession) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('home');
    }

    /**
     * Create a new data but not storing that to database yet.
     */
    public function create(Request $request): JsonResponse|HttpResponse
    {
        $groqApiKey = env('AI_MODEL_API_KEY');

        $type = $request->input('type');
        $pageName = $request->input('name');
        $description = $request->input('description');
        $keyFeatures = $request->input('key_features');
        $targetAudience = $request->input('target_audience');
        $price = $request->input('price');
        $USP = $request->input('USP');
        $prompt = $request->input('prompt');

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . $groqApiKey,
        ])->accept('application/json')->post(
            'https://api.groq.com/openai/v1/chat/completions',
            [
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => "$prompt",
                    ],
                ],
                'model' => 'groq/compound-mini',
                'temperature' => 1,
                'max_completion_tokens' => 1024,
                'top_p' => 1,
                'stream' => false,
                'stop' => null,
                'compound_custom' => [
                    'tools' => [
                        'enabled_tools' => [
                            'web_search',
                            'code_interpreter',
                            'visit_website',
                        ],
                    ],
                ],
            ]

        );

        try {
            if ($response->failed()) {
                return response()->json([
                    'error' => $response->body(),
                ], 500)->header('Content-Type', 'application/json');
            }

            $json = $response->json();
            $AIGeneratedContent = $json['choices'][0]['message']['content'];
            preg_match('/```html\s*(.*?)\s*```/s', $AIGeneratedContent, $matches);
            $html = $matches[1];
            $previewSlug = $this->previewSession->slug($request, $pageName);

            $page = new Page;
            $page->forceFill([
                'user_id' => $request->user()->id,
                'name' => $pageName,
                'slug' => $previewSlug,
                'description' => $description ?: null,
                'key_features' => $keyFeatures,
                'audience' => $targetAudience ?: null,
                'price' => $price,
                'usp_description' => $USP ?: null,
            ]);

            $generation = new Generation;

            $generation->html = $html;
            $generation->prompt = $prompt;

            $this->previewSession->put($request, $previewSlug, $page, $generation);

            return response()->json([
                'preview_url' => route('preview', $previewSlug),
            ]);
        } catch (Exception $exception) {
            return response()->json([
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display preview page
     */
    public function preview(Request $request, string $page): Response
    {
        $previewSlug = $page;
        $page = $this->previewSession->page($request, $previewSlug);

        abort_if($page === null, 404);

        return Inertia::render('preview', [
            'generatedUrl' => route('page', $previewSlug) . '?preview=true',
            'pageName' => $page->name,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
