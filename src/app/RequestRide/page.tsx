'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { LatLngExpression } from 'leaflet';

// Dynamically import MapLibre component to avoid SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function RequestRide() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    pickup: '',
    destination: ''
  });
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [pickupCoords, setPickupCoords] = useState<LatLngExpression | undefined>();
  const [destinationCoords, setDestinationCoords] = useState<LatLngExpression | undefined>();
  const [distance, setDistance] = useState<number | null>(null);

  // Geocode function using Nominatim
  async function geocode(address: string): Promise<LatLngExpression | undefined> {
    if (!address) return undefined;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('Geocode result for', address, data);
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.error('Geocoding error:', e);
    }
    return undefined;
  }

  // Haversine formula for distance in km
  function haversineDistance(coord1: LatLngExpression, coord2: LatLngExpression): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const [lat1, lon1] = coord1 as [number, number];
    const [lat2, lon2] = coord2 as [number, number];
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Update coordinates and distance when pickup or destination changes
  useEffect(() => {
    async function updateCoords() {
      const pickup = await geocode(form.pickup);
      const dest = await geocode(form.destination);
      setPickupCoords(pickup);
      setDestinationCoords(dest);
      if (pickup && dest) {
        setDistance(haversineDistance(pickup, dest));
      } else {
        setDistance(null);
      }
      console.log('Pickup coords:', pickup, 'Destination coords:', dest);
    }
    if (form.pickup && form.destination) {
      updateCoords();
    } else {
      setPickupCoords(undefined);
      setDestinationCoords(undefined);
      setDistance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.pickup, form.destination]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/LoginPage');
      }
    });
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const BASE_FARE = 500;
  const PER_KM_RATE = 200;
  const [showSummary, setShowSummary] = useState(false);

  const price = distance !== null ? BASE_FARE + distance * PER_KM_RATE : null;

  const handleShowSummary = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleConfirmRide = async () => {
    const { error } = await supabase.from('rides').insert([form]);
    if (error) {
      console.error('Insert error:', error.message);
    } else {
      setSuccess(true);
      setForm({ name: '', phone: '', pickup: '', destination: '' });
      setShowSummary(false);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b2e1e] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-green-900 rounded-2xl shadow-lg p-10 md:p-12 animate-fadeIn">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-green-300">
          Request a Ride
        </h1>

        {success && (
          <div className="mb-4 bg-green-800 text-green-200 border border-green-600 px-4 py-2 rounded text-center font-semibold">
            Ride requested successfully!
          </div>
        )}

        <form onSubmit={handleShowSummary} className="space-y-6">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={showSummary}
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={showSummary}
          />
          <input
            type="text"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            required
            placeholder="Pickup Location"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={showSummary}
          />
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            required
            placeholder="Destination"
            className="w-full px-4 py-3 rounded-lg border border-green-700 bg-green-800 text-green-100 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            disabled={showSummary}
          />
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
            disabled={showSummary || !form.name || !form.phone || !form.pickup || !form.destination}
          >
            Request Ride
          </button>
        </form>

        {showSummary && distance !== null && price !== null && (
          <div className="mt-6 bg-green-800 border border-green-600 rounded-xl p-6 text-green-100 animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-green-300 text-center">Ride Summary</h2>
            <div className="mb-2"><span className="font-semibold">Pickup:</span> {form.pickup}</div>
            <div className="mb-2"><span className="font-semibold">Destination:</span> {form.destination}</div>
            <div className="mb-2"><span className="font-semibold">Distance:</span> {distance.toFixed(2)} km</div>
            <div className="mb-4"><span className="font-semibold">Estimated Price:</span> ₦{price.toFixed(0)}</div>
            <button
              onClick={handleConfirmRide}
              className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Confirm Ride
            </button>
            <button
              onClick={() => setShowSummary(false)}
              className="w-full mt-2 bg-green-900 hover:bg-green-700 text-green-200 py-2 rounded-lg font-semibold transition"
            >
              Edit Details
            </button>
          </div>
        )}
      </div>

      {/* Map and attribution */}
      <div className="mt-8 w-full max-w-2xl">
        {distance !== null && (
          <div className="mb-2 text-green-200 text-center font-semibold">
            Distance: {distance.toFixed(2)} km
          </div>
        )}
        <Map pickup={pickupCoords} destination={destinationCoords} />
        <p className="text-xs text-green-400 mt-2 text-center">
          Map data © <a href="https://openfreemap.org" className="underline" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>, tiles by OpenMapTiles, data © <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>
        </p>
      </div>
    </div>
  );
}
