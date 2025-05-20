'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [dynamicContent, setDynamicContent] = useState('');

  useEffect(() => {
    // Runs only on client side, avoids hydration issues
    setDynamicContent('Enjoy your ride with Galaxy Ride!');
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0b2e1e] text-white flex flex-col items-center justify-center px-4 py-8 relative">
      
      {/* Top fading text over dark green */}
      <div className="absolute top-0 left-0 w-full bg-[#0b2e1e] text-center py-4 animate-fadeText z-10">
        <p className="text-lg font-semibold text-green-300">
          Welcome to Galaxy Ride — Your trusted ride service!
        </p>
      </div>

      {/* Spacer to avoid overlap with top text */}
      <div className="h-16"></div>

      {/* Logo / Title */}
      <h1 className="text-5xl font-bold mb-6 text-center z-0 relative">
        Galaxy<span className="text-green-400">Ride</span>
      </h1>

      {/* Image with fade-in animation */}
      <div className="w-full max-w-md mb-8 animate-fadeIn z-0 relative">
        <Image
          src="/galaxy-ride.jpg"
          alt="Galaxy Ride Car"
          width={400}
          height={400}
          className="mx-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Description */}
      <p className="text-lg mb-10 max-w-xl text-center text-green-100 z-0 relative">
        Your reliable ride booking service — fast, easy, and secure.
      </p>

      {/* Dynamic content rendered only on client, suppress hydration warning */}
      <p suppressHydrationWarning className="text-center text-green-200 mb-6">
        {dynamicContent}
      </p>

      {/* Call-to-action buttons */}
      <div className="flex space-x-4 z-0 relative">
        <Link
          href="/RequestRide"
          className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg font-medium transition"
        >
          Request a Ride
        </Link>
        <Link
          href="/CancelRide"
          className="px-6 py-3 bg-green-700 hover:bg-green-600 rounded-lg font-medium transition"
        >
          Cancel a Ride
        </Link>
      </div>
    </div>
  );
}
