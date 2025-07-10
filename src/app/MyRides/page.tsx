'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface Ride {
  id: number;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  status: string;
  created_at: string;
}

export default function MyRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Auth check and get user id
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/LoginPage');
      } else {
        setUserId(session.user.id);
      }
    });
  }, [router]);

  // Fetch rides for this user
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from('rides')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Fetch rides error:', error.message);
        } else {
          setRides(data || []);
        }
        setLoading(false);
      });
  }, [userId]);

  // Cancel a ride
  const handleCancel = async (id: number) => {
    await supabase.from('rides').update({ status: 'cancelled' }).eq('id', id);
    setRides(rides => rides.filter(r => r.id !== id));
  };

  // Complete a ride
  const handleComplete = async (id: number) => {
    await supabase.from('rides').update({ status: 'completed' }).eq('id', id);
    setRides(rides => rides.map(r => r.id === id ? { ...r, status: 'completed' } : r));
  };

  const inProgress = rides.filter(r => r.status === 'requested' || r.status === 'in_progress');
  const finalized = rides.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-[#0b2e1e] flex flex-col items-center px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-8 text-green-300">My Rides</h1>
      {loading ? (
        <div className="text-green-200">Loading rides...</div>
      ) : (
        <div className="w-full max-w-2xl space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4 text-green-200">In Progress</h2>
            {inProgress.length === 0 ? (
              <div className="text-green-400">No rides in progress.</div>
            ) : (
              <ul className="space-y-4">
                {inProgress.map(ride => (
                  <li key={ride.id} className="bg-green-900 border border-green-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div><span className="font-semibold">From:</span> {ride.pickup}</div>
                      <div><span className="font-semibold">To:</span> {ride.destination}</div>
                      <div className="text-xs text-green-400 mt-1">Requested: {new Date(ride.created_at).toLocaleString()}</div>
                    </div>
                    <div className="mt-3 md:mt-0 flex gap-2">
                      <button
                        onClick={() => handleComplete(ride.id)}
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => handleCancel(ride.id)}
                        className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4 text-green-200">Finalized</h2>
            {finalized.length === 0 ? (
              <div className="text-green-400">No finalized rides yet.</div>
            ) : (
              <ul className="space-y-4">
                {finalized.map(ride => (
                  <li key={ride.id} className="bg-green-900 border border-green-700 rounded-xl p-5">
                    <div><span className="font-semibold">From:</span> {ride.pickup}</div>
                    <div><span className="font-semibold">To:</span> {ride.destination}</div>
                    <div className="text-xs text-green-400 mt-1">Completed: {new Date(ride.created_at).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
} 