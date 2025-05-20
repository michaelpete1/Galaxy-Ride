'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Hamburger and Close icons (or replace with emojis/icons if not using Lucide)

type NavItem = {
  id: string;
  label: string;
  href: string;
};

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'signup', label: 'Sign Up', href: '/SignupPage' },
    { id: 'login', label: 'Login', href: '/LoginPage' },
    { id: 'request', label: 'Request Ride', href: '/RequestRide' },
    { id: 'cancel', label: 'Cancel Ride', href: '/CancelRide' },
    { id: 'profile', label: 'Profile', href: '/ProfilePage' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-green-800 p-2 rounded-md focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-green-900 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-40 shadow-lg`}
      >
        <div className="py-6 px-4 flex flex-col space-y-6">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-green-300"
            onClick={() => {
              setActiveItem('home');
              setIsOpen(false);
            }}
          >
            Galaxy<span className="text-green-300">Ride</span>
          </Link>

          <nav className="flex flex-col w-full space-y-2 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all overflow-hidden group
                  ${activeItem === item.id
                    ? 'bg-green-700 text-white'
                    : 'text-green-200 hover:text-white'
                  }`}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsOpen(false);
                }}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Bubble animation */}
                <span className="absolute inset-0 bg-green-600 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-md z-0 opacity-20" />
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
