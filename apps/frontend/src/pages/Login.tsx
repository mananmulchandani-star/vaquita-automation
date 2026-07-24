import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export function Login() {
  const [email, setEmail] = useState('');
  const [storeDomain, setStoreDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res: any = await api.post('/shopify/auth/login', {
        email,
        storeDomain: storeDomain ? storeDomain.trim() : undefined,
      });

      if (res.data?.token) {
        localStorage.setItem('auth_token', res.data.token);
        if (res.data.store?.id) {
          localStorage.setItem('store_id', res.data.store.id);
        }
        navigate('/');
      } else {
        setError('Login failed: Token not received');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstallShopify = () => {
    if (!storeDomain) {
      setError('Please enter your Shopify Store Domain to install');
      return;
    }
    const cleanShop = storeDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    window.location.href = `/api/v1/shopify/auth?shop=${encodeURIComponent(cleanShop)}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            VAQUITA Automation
          </h1>
          <p className="text-slate-400 text-sm mt-2">Sign in to your Shopify Automation Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Store Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourstore.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Shopify Store Domain (Optional)
            </label>
            <input
              type="text"
              value={storeDomain}
              onChange={(e) => setStoreDomain(e.target.value)}
              placeholder="my-store.myshopify.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 font-semibold py-3 rounded-lg text-sm text-slate-950 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400 mb-3">Connecting a new Shopify store?</p>
          <button
            type="button"
            onClick={handleInstallShopify}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline"
          >
            Install App via Shopify OAuth
          </button>
        </div>
      </div>
    </div>
  );
}
