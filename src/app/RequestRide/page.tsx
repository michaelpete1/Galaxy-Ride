'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function RequestRide() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('rides').insert([form]);

    if (error) {
      console.error('Insert error:', error.message);
    } else {
      setSuccess(true);
      setForm({ name: '', phone: '', pickup: '', destination: '' });
      // Optional: reset success message after few seconds
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2e1e] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-green-900 rounded-2xl shadow-lg p-10 md:p-12 animate-fadeIn">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-300">
          Request a Ride
        </h1>

        {success && (
          <div className="mb-4 bg-green-800 text-green-200 border border-green-600 px-4 py-2 rounded text-center font-semibold">
            Ride requested successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            required
            placeholder="Pickup Location"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            placeholder="Destination"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Request Ride
          </button>
        </form>
      </div>
    </div>
  );
}
