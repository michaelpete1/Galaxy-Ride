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

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-semibold mb-6 text-center text-green-900 tracking-wide">
          Login to Galaxy Ride
        </h1>

        <p className="text-center text-green-700 mb-8 h-8 font-mono tracking-wider animate-fadeInOut">
          {typedText}
        </p>

        {error && (
          <p className="text-red-600 mb-6 text-center font-medium animate-pulse">
            {error}
          </p>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-5 py-3 rounded-md text-center font-medium animate-fadeInOut">
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
            className="w-full px-5 py-3 border border-green-300 rounded-lg text-green-900 placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow duration-300"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-5 py-3 border border-green-300 rounded-lg text-green-900 placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors duration-300 font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
