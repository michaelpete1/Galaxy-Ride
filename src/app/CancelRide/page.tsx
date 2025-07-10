'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // For navigation
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CancelRide() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/LoginPage');
      }
    });
  }, [router]);

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
    const isError =
      message.toLowerCase().includes('error') ||
      message.toLowerCase().includes('no ride');

    return (
      <div
        className={`mb-4 text-center px-4 py-2 rounded-lg text-sm font-mono animate-fadeIn ${
          isError
            ? 'bg-red-200 text-red-700 border border-red-400'
            : 'bg-green-200 text-green-900 border border-green-400'
        }`}
      >
        {message}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-12 md:p-16">
        <div className="flex flex-col items-center justify-center mb-6 space-y-2">
          <span className="text-6xl select-none">🚫</span>
          <h1 className="text-4xl font-extrabold text-green-900 tracking-tight">
            Cancel Ride
          </h1>
          <Link
            href="/RequestRide"
            className="text-green-700 hover:text-green-500 font-semibold underline transition"
          >
            Get New Ride
          </Link>
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
            className="w-full px-5 py-3 border border-green-600 rounded-lg text-green-900 placeholder-green-500 focus:outline-none focus:ring-4 focus:ring-green-700 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 disabled:opacity-60 transition font-semibold"
          >
            {loading ? 'Cancelling...' : 'Cancel Ride'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-green-600 font-mono">
          Cancel anytime before the ride begins.
        </p>
      </div>
    </div>
  );
}
