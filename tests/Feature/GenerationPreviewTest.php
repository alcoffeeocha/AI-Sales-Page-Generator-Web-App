<?php

use App\Models\Generation;
use App\Models\Page;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('authenticated users can preview a generated page from session', function () {
    $user = User::factory()->create();
    $pageSlug = 'launch-offer';

    $this->actingAs($user)
        ->withSession([
            'generated_page_previews' => [
                $pageSlug => [
                    'page' => [
                        'user_id' => $user->id,
                        'name' => 'Launch Offer',
                        'slug' => $pageSlug,
                        'description' => 'A fast campaign page.',
                        'key_features' => 'Fast setup',
                        'audience' => 'Founders',
                        'price' => '$99',
                        'usp_description' => 'Launch today.',
                    ],
                    'generation' => [
                        'prompt' => 'Create a sales page.',
                        'html' => '<main><h1>Generated page</h1></main>',
                    ],
                ],
            ],
        ])
        ->get(route('preview', $pageSlug))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('preview')
            ->where('generatedUrl', route('page', $pageSlug).'?preview=true')
            ->where('pageName', 'Launch Offer')
        );
});

test('authenticated users can view generated html from preview session', function () {
    $user = User::factory()->create();
    $pageSlug = 'launch-offer';

    $this->actingAs($user)
        ->withSession([
            'generated_page_previews' => [
                $pageSlug => [
                    'page' => [
                        'user_id' => $user->id,
                        'name' => 'Launch Offer',
                        'slug' => $pageSlug,
                    ],
                    'generation' => [
                        'prompt' => 'Create a sales page.',
                        'html' => '<main><h1>Generated page</h1></main>',
                    ],
                ],
            ],
        ])
        ->get(route('page', ['page' => $pageSlug, 'preview' => 'true']))
        ->assertOk()
        ->assertSee('<main><h1>Generated page</h1></main>', false);
});

test('authenticated users can view persisted generated html by page slug', function () {
    $user = User::factory()->create();
    $page = Page::query()->create([
        'user_id' => $user->id,
        'name' => 'Launch Offer',
        'slug' => 'launch-offer',
        'key_features' => 'Fast setup',
    ]);

    Generation::query()->create([
        'page_id' => $page->id,
        'prompt' => 'Create a sales page.',
        'html' => '<main><h1>Persisted page</h1></main>',
    ]);

    $this->actingAs($user)
        ->get(route('page', $page->slug))
        ->assertOk()
        ->assertSee('<main><h1>Persisted page</h1></main>', false);
});

test('persisted sales page returns not found when generation is missing', function () {
    $user = User::factory()->create();
    $page = Page::query()->create([
        'user_id' => $user->id,
        'name' => 'Launch Offer',
        'slug' => 'launch-offer',
        'key_features' => 'Fast setup',
    ]);

    $this->actingAs($user)
        ->get(route('page', $page->slug))
        ->assertNotFound();
});
