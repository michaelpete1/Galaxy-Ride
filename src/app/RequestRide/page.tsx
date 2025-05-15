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
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 md:p-12">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-navy-900">
          Request a Ride
        </h1>

        {success && (
          <div className="mb-4 bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-center">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            required
            placeholder="Pickup Location"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            placeholder="Destination"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-navy-800 text-white py-3 rounded-lg hover:bg-navy-900 transition"
          >
            Request Ride
          </button>
        </form>
      </div>
    </div>
  );
}
