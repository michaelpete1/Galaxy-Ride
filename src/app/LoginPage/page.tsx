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
        className={`mb-6 px-5 py-3 rounded-md text-center text-sm font-medium ${
          isError
            ? 'bg-red-100 text-red-600 border border-red-300 animate-pulse'
            : 'bg-green-100 text-green-800 border border-green-300 animate-fadeIn'
        }`}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-5xl mb-2">🚫</span>
          <h1 className="text-4xl font-semibold text-green-900 tracking-wide text-center">
            Cancel Ride
          </h1>
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
            className="w-full px-5 py-3 border border-green-300 rounded-lg text-green-900 placeholder-green-400 focus:outline-none focus:ring-4 focus:ring-green-300 transition-shadow duration-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors duration-300 font-semibold"
          >
            {loading ? 'Cancelling...' : 'Cancel Ride'}
          </button>
        </form>

        <div className="mt-6 text-center text-green-700 text-sm font-mono tracking-wider">
          Cancel anytime before the ride begins.
        </div>
      </div>
    </div>
  );
}
