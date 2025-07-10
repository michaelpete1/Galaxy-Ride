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
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 md:gap-10 items-center justify-center">
          {/* Hero Card */}
          <div className="flex-1 w-full bg-white/95 rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 flex flex-col items-center mb-8 md:mb-0">
            <div className="flex items-center mb-6 md:mb-8">
              <Car className="w-12 h-12 md:w-16 md:h-16 text-green-700 mr-3 md:mr-4" />
              <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 tracking-tight">Galaxy<span className="text-green-500">Ride</span></h1>
            </div>
            <p className="text-lg md:text-2xl text-green-800 mb-6 md:mb-10 text-center font-medium">Your trusted ride service—fast, safe, and always available.</p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full justify-center mb-6 md:mb-10">
              <Link
                href="/RequestRide"
                className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-green-700 hover:bg-green-800 text-white rounded-2xl text-lg md:text-2xl font-bold shadow-lg transition text-center"
              >
                Request a Ride
              </Link>
              <Link
                href="/ProfilePage"
                className="w-full sm:w-auto px-6 md:px-10 py-4 md:py-5 bg-white border-2 border-green-400 text-green-800 rounded-2xl text-lg md:text-2xl font-bold shadow-lg hover:bg-green-50 transition text-center"
              >
                View Profile
              </Link>
            </div>
            <p className="text-green-600 text-center mt-2 md:mt-4 text-base md:text-lg">Welcome back! Book or manage your rides with ease.</p>
          </div>
          {/* Map */}
          <div className="flex-1 w-full max-w-xl min-h-[300px] md:min-h-0" style={{ minWidth: 0 }}>
            <MapComponent />
          </div>
        </div>
      </main>
      <footer className="w-full py-6 md:py-8 flex flex-col md:flex-row items-center justify-between bg-black/70 text-green-100 rounded-t-3xl mt-8 md:mt-12 px-4 md:px-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Car className="w-7 h-7 text-green-400" />
          <span className="text-xl font-bold tracking-tight">Galaxy<span className="text-green-300">Ride</span></span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-green-200 text-base items-center">
          <Link href="/RequestRide" className="hover:text-green-400 transition">Request Ride</Link>
          <Link href="/ProfilePage" className="hover:text-green-400 transition">Profile</Link>
        </div>
        <div className="text-green-400 text-sm mt-4 md:mt-0">&copy; {new Date().getFullYear()} GalaxyRide. All rights reserved.</div>
      </footer>
    </div>
  );
}
