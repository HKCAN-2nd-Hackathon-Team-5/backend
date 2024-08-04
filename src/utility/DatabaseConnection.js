import { createClient } from '@supabase/supabase-js';

export default function (app) {
    app.locals.db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    console.log('Connected to PostgreSQL');
}
