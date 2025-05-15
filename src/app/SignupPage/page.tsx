'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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

    // Optionally insert user details into another table (e.g. profiles)
    // Here is an example if you have a profiles table with id matching supabase auth user id:
    /*
    const user = supabase.auth.user();
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: user.id, name: form.name, phone: form.phone }]);
      if (profileError) {
        setMessage(`Profile save error: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }
    */

    setMessage('Signup successful! Please check your email to confirm.');
    setLoading(false);
    setForm({ email: '', password: '', name: '', phone: '' });
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
      {message && (
        <p className={`mb-4 text-center ${message.startsWith('Signup error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy-800 text-white py-2 rounded hover:bg-navy-900 disabled:opacity-50"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
