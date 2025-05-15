'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white px-4 relative overflow-hidden">
      {/* Animated Car Sticker */}
      <div className="w-full max-w-lg mb-6 animate-bounce">
        <Image
          src="/galaxy-ride.jpg" // ✅ Correct way to reference public image
          alt="Galaxy Ride Car"
          width={400}
          height={400}
          className="mx-auto"
        />
      </div>

      <h1 className="text-4xl font-bold mb-4 animate-fadeIn">Welcome to Galaxy Ride</h1>
      <p className="text-lg mb-8 max-w-xl text-center animate-fadeIn">
        Your reliable ride booking service — fast, easy, and secure.
      </p>

      <div className="space-x-4 animate-fadeIn">
        <Link href="/LoginPage" className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded font-semibold transition">
          Login
        </Link>
        <Link href="/SignupPage" className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded font-semibold transition">
          Sign Up
        </Link>
      </div>

      <div className="mt-10 space-x-4 animate-fadeIn">
        <Link href="/RequestRide" className="underline hover:text-blue-300">
          Request a Ride
        </Link>
        <Link href="/CancelRide" className="underline hover:text-blue-300">
          Cancel a Ride
        </Link>
      </div>
    </div>
  );
}
