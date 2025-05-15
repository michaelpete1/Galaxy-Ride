'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CancelRide() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Find ride by phone number
    const { data: rides, error: fetchError } = await supabase
      .from('rides')
      .select('id')
      .eq('phone', phone);

    if (fetchError) {
      setLoading(false);
      setMessage(`Error fetching ride: ${fetchError.message}`);
      return;
    }

    if (!rides || rides.length === 0) {
      setLoading(false);
      setMessage('No ride found with this phone number.');
      return;
    }

    // Assuming we delete all rides under this phone, or you can handle differently
    const rideIds = rides.map((ride) => ride.id);

    const { error: deleteError } = await supabase
      .from('rides')
      .delete()
      .in('id', rideIds);

    setLoading(false);

    if (deleteError) {
      setMessage(`Error cancelling ride: ${deleteError.message}`);
    } else {
      setMessage('Ride cancelled successfully.');
      setPhone('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Cancel Ride</h1>
      {message && (
        <p className={`mb-4 text-center ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleCancel} className="space-y-4">
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy-800 text-white py-2 rounded hover:bg-navy-900 disabled:opacity-50"
        >
          {loading ? 'Cancelling...' : 'Cancel Ride'}
        </button>
      </form>
    </div>
  );
}
