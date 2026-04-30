# Getting Started

1. Update .env according server environment
2. Ensure database with specified name is exist
3. Run `php artisan migrate`

## How I develop features

I pick a feature to work on, and do it end-to-end.

Steps:

1. Start with migrations to define the schema
2. Create models for that schema so the app logic can interact with
3. Define routes (also middleware if needed)
4. Create controllers
5. Implement frontend in `resources` folder
6. Implement validation in Requests
