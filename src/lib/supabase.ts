import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fvicrbnpxrjlurcubwwo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2aWNyYm5weHJqbHVyY3Vid3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODMyMDksImV4cCI6MjA4NzA1OTIwOX0.5Vb2c1qUjDPlMSKuh_7_J0gUEpm3O36EhuuHagc4x_I';

export const supabase = createClient(supabaseUrl, supabaseKey);
