import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

// Substitua SUA_ANON_KEY pela chave "anon / public" que está em:
// Configurações (Settings) > API no painel do Supabase.
const supabaseUrl = 'https://gtbwvuvtvvkuwiwtzrxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Ynd2dXZ0dnZrdXdpd3R6cnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NDE3MjksImV4cCI6MjEwMDUxNzcyOX0.t2wsvbMe1X9xt9R5ytrCtqYUXLWMta7XngHK-a29IcE';

export const supabase = createClient(supabaseUrl, supabaseKey);
