import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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

    const { uid, pin, name } = req.body;
    
    if (!uid || !pin) {
      return res.status(400).json({ error: 'UID and PIN are required' });
    }

    if (pin.length < 4) {
      return res.status(400).json({ error: 'PIN must be at least 4 characters long' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pin, salt);

    const { data, error } = await supabase
      .from('users')
      .upsert({ 
        id: uid, 
        senha_bolao: hash
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error saving PIN:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
