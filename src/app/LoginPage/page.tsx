'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fullText = "Fast. Secure. Reliable. Welcome back!";
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText[index]);
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccessMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Login successful! Redirecting...');
      console.log('Logged in:', data);

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 md:p-12">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-navy-900 animate-fadeIn">
          Login to Galaxy Ride
        </h1>

        <p className="text-center text-blue-600 mb-6 h-6 font-mono tracking-wide animate-fadeIn">
          {typedText}
        </p>

        {error && (
          <p className="text-red-600 mb-4 text-center animate-pulse">{error}</p>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-center animate-fadeIn">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 text-white py-3 rounded-lg hover:bg-navy-900 disabled:opacity-50 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
