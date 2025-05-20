'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { UserIcon } from '@heroicons/react/24/solid';

export default function SignupPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMessage(`Signup error: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage('Signup successful! Please check your email to confirm.');
    setLoading(false);
    setForm({ email: '', password: '', name: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-[#0b2e1e] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-green-900 rounded-2xl shadow-lg p-10 md:p-12 animate-fadeIn">
        <h1 className="flex items-center justify-center text-3xl font-bold mb-6 text-green-300">
          <UserIcon className="h-7 w-7 mr-2 text-green-400 animate-pulse" />
          Sign Up
        </h1>

        {message && (
          <p
            className={`mb-4 text-center ${
              message.startsWith('Signup error') ? 'text-red-500' : 'text-green-400'
            } font-semibold`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-green-300">
          Already have an account?{' '}
          <Link
            href="/LoginPage"
            className="font-semibold text-green-400 hover:text-green-300 transition duration-300 animate-pulse"
            aria-label="Go to login page"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
