'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Car } from 'lucide-react';
import Link from 'next/link';
import maplibregl from 'maplibre-gl';
import MapComponent from './components/Map';

export default function Home() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/LoginPage');
      }
    });
  }, [router]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [7.49508, 9.05785],
      zoom: 12,
    });
    return () => map.remove();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-green-900 via-black to-green-950 px-2 md:px-8">
      <main className="flex flex-1 flex-col items-center justify-center py-8">
        <p className="text-2xl md:text-3xl font-bold text-green-200 text-center mb-8 drop-shadow-lg opacity-0 animate-fadeIn motion-safe:animate-fadeInUp">
          Book your ride with ease.
        </p>
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-10 items-center justify-center">
          {/* Hero Card */}
          <div className="flex-1 bg-white/95 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center mb-10 md:mb-0">
            <div className="flex items-center mb-8">
              <Car className="w-16 h-16 text-green-700 mr-4" />
              <h1 className="text-6xl font-extrabold text-green-900 tracking-tight">Galaxy<span className="text-green-500">Ride</span></h1>
            </div>
            <p className="text-2xl text-green-800 mb-10 text-center font-medium">Your trusted ride service—fast, safe, and always available.</p>
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center mb-10">
              <Link
                href="/RequestRide"
                className="w-full md:w-auto px-10 py-5 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-2xl font-bold shadow-lg transition text-center"
              >
                Request a Ride
              </Link>
              <Link
                href="/ProfilePage"
                className="w-full md:w-auto px-10 py-5 bg-white border-2 border-green-400 text-green-800 rounded-2xl text-2xl font-bold shadow-lg hover:bg-green-50 transition text-center"
              >
                View Profile
              </Link>
            </div>
            <p className="text-green-600 text-center mt-4 text-lg">Welcome back! Book or manage your rides with ease.</p>
          </div>
          {/* Map */}
          <div className="flex-1 w-full max-w-xl">
            <MapComponent />
          </div>
        </div>
      </main>
      <footer className="w-full py-8 flex flex-col md:flex-row items-center justify-between bg-black/70 text-green-100 rounded-t-3xl mt-12 px-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Car className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold tracking-tight">Galaxy<span className="text-green-300">Ride</span></span>
        </div>
        <div className="flex gap-6 text-green-200 text-base">
          <Link href="/RequestRide" className="hover:text-green-400 transition">Request Ride</Link>
          <Link href="/ProfilePage" className="hover:text-green-400 transition">Profile</Link>
          <Link href="/CancelRide" className="hover:text-green-400 transition">Cancel Ride</Link>
        </div>
        <div className="text-green-400 text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} GalaxyRide. All rights reserved.</div>
      </footer>
    </div>
  );
}
