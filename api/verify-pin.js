import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { uid, pin } = req.body;
    
    if (!uid || !pin) {
      return res.status(400).json({ error: 'UID and PIN are required' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('senha_bolao')
      .eq('id', uid)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'User not found' });
      }
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data.senha_bolao) {
      return res.status(400).json({ error: 'User has no PIN set' });
    }

    const isValid = bcrypt.compareSync(pin, data.senha_bolao);

    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'PIN incorreto' });
    }

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
