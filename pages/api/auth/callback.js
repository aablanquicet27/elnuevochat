// pages/api/auth/callback.js
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default async function handler(req, res) {
  // Crear cliente de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => {
          const cookie = req.cookies[name];
          return cookie ? { name, value: cookie } : undefined;
        },
        set: (name, value, options) => {
          res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove: (name, options) => {
          res.setHeader('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
        },
      },
    }
  );

  // Obtener el código de la URL
  const { code } = req.query;
  
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirigir al dashboard
  res.redirect('/dashboard');
}
