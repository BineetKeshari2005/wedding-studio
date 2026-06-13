# AI Wedding Studio - Backend

This directory contains the backend resources for the AI Wedding Studio, which are powered by **Supabase**.

## Structure

- `supabase/`
  - `config.toml`: Configuration for the local Supabase instance.
  - `migrations/`: SQL migration files containing database schema definitions, tables (`profiles`, `projects`), Row Level Security (RLS) policies, and triggers.

## Prerequisites

To manage and apply local database migrations, you need the **Supabase CLI**. You can install it via:

```bash
# Using npm
npm install -g supabase

# Or using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Local Development & Migrations

1. **Initialize/Start Supabase locally** (requires Docker running):
   ```bash
   supabase start
   ```

2. **Apply migrations** to your local Supabase database:
   ```bash
   supabase db reset
   ```

3. **Deploy to production Supabase project**:
   ```bash
   supabase db push
   ```
