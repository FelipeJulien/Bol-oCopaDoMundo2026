import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase environment variables' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { uid } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, senha_bolao')
      .eq('id', uid)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
      return res.status(200).json({ exists: false, hasPin: false });
    }

    const hasPin = data.senha_bolao && data.senha_bolao.trim().length > 0;
    
    return res.status(200).json({ 
      exists: true, 
      hasPin: !!hasPin 
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
