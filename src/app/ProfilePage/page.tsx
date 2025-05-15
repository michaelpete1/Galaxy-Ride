'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

interface ProfileData {
  name: string;
  phone: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({ name: '', phone: '' });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setMessage('Failed to load user info.');
        setLoading(false);
        return;
      }

      setUser(data.user);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('name, phone')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        // Auto-create profile if not found
        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name: '',
          phone: '',
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          setMessage(`Error creating profile: ${insertError.message}`);
        } else {
          setProfile({ name: '', phone: '' });
        }
      } else if (profileData) {
        setProfile({
          name: profileData.name || '',
          phone: profileData.phone || '',
        });
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!user) return;

    const updates = {
      id: user.id,
      name: profile.name,
      phone: profile.phone,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    setMessage(error ? 'Failed to update profile.' : 'Profile updated successfully!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/LoginPage';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-navy-900 text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 md:p-12">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-navy-900">Your Profile</h1>

        {message && (
          <p
            className={`mb-6 text-center px-4 py-2 rounded ${
              message.toLowerCase().includes('failed')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
              Email (read-only)
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="name" className="block mb-1 font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Your Phone Number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-navy-800 text-white py-3 rounded-lg hover:bg-navy-900 transition"
          >
            Update Profile
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-6 w-full border border-red-500 text-red-600 py-3 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
