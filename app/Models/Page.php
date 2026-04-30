<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    // These are defaults, but explicitly specified for learning.
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pages';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The data type of the primary key.
     *
     * @var string
     */
    protected $keyType = 'int';

    /**
     * Indicates if the model's primary key is auto-incrementing.
     * Need UUID? https://laravel.com/docs/12.x/eloquent#uuid-and-ulid-keys
     *
     * @var bool
     */
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'key_features',
        'audience',
        'price',
        'usp_description',
    ];

    protected static function boot(): void
    {
        parent::boot();

        // Automatically generate slug from name when creating a new page
        static::creating(function ($page) {
            $page->slug = Str::slug($page->name.'_'.$page->id);
        });

        static::updating(function ($page) {
            if ($page->isDirty('name')) {
                $page->slug = Str::slug($page->name.'_'.$page->id);
            }
        });
    }
}
