'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-navy-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Galaxy Ride</h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        Your reliable ride booking service — fast, easy, and secure.
      </p>

      <div className="space-x-4">
        <Link
          href="/LoginPage"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded font-semibold transition"
        >
          Login
        </Link>
        <Link
          href="/SignupPage"
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded font-semibold transition"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-10 space-x-4">
        <Link
          href="/RequestRide"
          className="underline hover:text-blue-300"
        >
          Request a Ride
        </Link>
        <Link
          href="/CancelRide"
          className="underline hover:text-blue-300"
        >
          Cancel a Ride
        </Link>
      </div>
    </div>
  );
}
