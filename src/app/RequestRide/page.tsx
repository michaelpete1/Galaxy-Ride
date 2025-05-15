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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Request a Ride</h1>
      {success && <p className="text-green-600 mb-4 text-center">Ride requested successfully!</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Phone Number"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="pickup"
          value={form.pickup}
          onChange={handleChange}
          required
          placeholder="Pickup Location"
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="destination"
          value={form.destination}
          onChange={handleChange}
          required
          placeholder="Destination"
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-navy-800 text-white py-2 rounded hover:bg-navy-900"
        >
          Request Ride
        </button>
      </form>
    </div>
  );
}
