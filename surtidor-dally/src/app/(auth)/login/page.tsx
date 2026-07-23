'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fuel, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Allow username without domain (e.g. 'admin' -> 'admin@dallysrl.bo')
      const formattedEmail = email.includes('@') ? email : `${email}@dallysrl.bo`;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      });

      if (authError) {
        setError(authError.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error inesperado al conectar con Supabase.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-[120px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-surface border border-border rounded-2xl p-10 shadow-2xl">
          {/* Logo & Branding */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold tracking-figma text-text-primary">
                  DALLY SRL
                </div>
                <div className="text-xs tracking-figma-wide text-text-muted">
                  SISTEMA DE GESTIÓN
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-figma text-text-primary mb-2">
              ACCESO AL SISTEMA
            </h1>
            <p className="text-sm text-text-secondary">
              Ingrese sus credenciales de operador (Supabase Auth).
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} id="login-form">
            {/* Email/Username */}
            <div className="mb-6">
              <label
                htmlFor="login-email"
                className="text-xs tracking-figma-wide text-text-muted block mb-2"
              >
                USUARIO O CORREO
              </label>
              <input
                type="text"
                id="login-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@dallysrl.bo"
                className="w-full bg-surface-alt border border-border rounded-lg px-4 py-3.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label
                htmlFor="login-password"
                className="text-xs tracking-figma-wide text-text-muted block mb-2"
              >
                CONTRASEÑA
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-alt border border-border rounded-lg px-4 py-3.5 text-text-primary placeholder-text-muted focus:border-accent focus:outline-none transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  id="toggle-password-visibility"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm text-center animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-background font-bold tracking-figma py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                'INGRESAR AL SISTEMA'
              )}
            </button>
          </form>

          {/* Supabase status indicator */}
          <div className="mt-8 text-center">
            <p className="text-xs text-text-muted">
              Conectado a Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
