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

    const { data: rides, error: fetchError } = await supabase
      .from('rides')
      .select('id')
      .eq('phone', phone);

    if (fetchError) {
      setLoading(false);
      setMessage(`error: ${fetchError.message}`);
      return;
    }

    if (!rides || rides.length === 0) {
      setLoading(false);
      setMessage('No ride found with this phone number.');
      return;
    }

    const rideIds = rides.map((ride) => ride.id);

    const { error: deleteError } = await supabase
      .from('rides')
      .delete()
      .in('id', rideIds);

    setLoading(false);

    if (deleteError) {
      setMessage(`error: ${deleteError.message}`);
    } else {
      setMessage('Ride cancelled successfully.');
      setPhone('');
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    const isError = message.toLowerCase().includes('error') || message.toLowerCase().includes('no ride');

    return (
      <div
        className={`mb-4 text-center px-4 py-2 rounded-lg text-sm animate-pulse ${
          isError ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-green-100 text-green-700 border border-green-300'
        }`}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-10 md:p-12">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-5xl">🚫</span>
          <h1 className="text-3xl font-extrabold mt-2 text-navy-900">Cancel Ride</h1>
        </div>

        {renderMessage()}

        <form onSubmit={handleCancel} className="space-y-6">
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-800 text-white py-3 rounded-lg hover:bg-navy-900 transition disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Cancel Ride'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-navy-800 animate-bounce">
          Cancel anytime before the ride begins.
        </div>
      </div>
    </div>
  );
}
