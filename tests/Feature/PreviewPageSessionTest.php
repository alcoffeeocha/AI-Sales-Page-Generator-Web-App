<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;

test('generated pages are stored in session for preview without saving a page', function () {
    Http::fake([
        'api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => "```html\n<main><h1>Generated page</h1></main>\n```",
                    ],
                ],
            ],
        ]),
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson(route('generate-html'), [
            'type' => 'product',
            'name' => 'Launch Offer',
            'description' => 'A fast campaign page.',
            'key_features' => 'Fast setup',
            'target_audience' => 'Founders',
            'price' => '$99',
            'USP' => 'Launch today.',
            'prompt' => 'Create a sales page.',
        ])
        ->assertOk()
        ->assertJsonPath('preview_url', route('preview', 'launch-offer'))
        ->assertSessionHas('generated_page_previews');

    $this->assertDatabaseCount('pages', 0);
    $this->assertDatabaseCount('generations', 0);
});

test('generated preview slugs are unique within the session', function () {
    Http::fake([
        'api.groq.com/*' => Http::response([
            'choices' => [
                [
                    'message' => [
                        'content' => "```html\n<main><h1>Generated page</h1></main>\n```",
                    ],
                ],
            ],
        ]),
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession([
            'generated_page_previews' => [
                'launch-offer' => [
                    'page' => [
                        'user_id' => $user->id,
                        'name' => 'Launch Offer',
                        'slug' => 'launch-offer',
                    ],
                    'generation' => [
                        'prompt' => 'Create a sales page.',
                        'html' => '<main><h1>Generated page</h1></main>',
                    ],
                ],
            ],
        ])
        ->postJson(route('generate-html'), [
            'type' => 'product',
            'name' => 'Launch Offer',
            'description' => 'A fast campaign page.',
            'key_features' => 'Fast setup',
            'target_audience' => 'Founders',
            'price' => '$99',
            'USP' => 'Launch today.',
            'prompt' => 'Create a sales page.',
        ])
        ->assertOk()
        ->assertJsonPath('preview_url', route('preview', 'launch-offer-2'))
        ->assertSessionHas('generated_page_previews.launch-offer-2');
});
