'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent! Please check your inbox.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-semibold mb-6 text-center text-green-900 tracking-wide">
          Forgot Password
        </h1>

        {error && (
          <p className="text-red-600 mb-6 text-center font-medium">
            {error}
          </p>
        )}

        {message && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-5 py-3 rounded-md text-center font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border border-green-300 rounded-lg text-green-900 placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors duration-300 font-semibold"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-semibold text-green-600 hover:text-green-800 underline transition-colors duration-200"
            aria-label="Back to home page"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
