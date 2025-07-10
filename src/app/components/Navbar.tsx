'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home, User, Car, Ban, KeyRound, UserPlus, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('home');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const homeHref = '/';
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: homeHref, icon: <Home className="w-5 h-5 mr-2" /> },
    { id: 'forgot', label: 'Forgot Password', href: '/ForgotPassword', icon: <KeyRound className="w-5 h-5 mr-2" /> },
    { id: 'request', label: 'Request Ride', href: '/RequestRide', icon: <Car className="w-5 h-5 mr-2" /> },
    { id: 'myrides', label: 'My Rides', href: '/MyRides', icon: <Car className="w-5 h-5 mr-2" /> },
    { id: 'profile', label: 'Profile', href: '/ProfilePage', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white bg-green-800 p-2 rounded-md focus:outline-none shadow-lg hover:bg-green-700 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-green-950 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-40 shadow-2xl border-r border-green-800`}
      >
        <div className="py-6 px-4 flex flex-col space-y-8 h-full">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight hover:text-green-300 flex items-center gap-2 mb-2"
            onClick={() => {
              setActiveItem('home');
              setIsOpen(false);
            }}
          >
            <Car className="w-7 h-7 text-green-400" />
            <span>Galaxy<span className="text-green-300">Ride</span></span>
          </Link>

          <nav className="flex flex-col w-full space-y-2 mt-4 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center relative px-4 py-2 rounded-lg text-base font-medium transition-all overflow-hidden group
                  ${activeItem === item.id
                    ? 'bg-green-700 text-white shadow'
                    : 'text-green-200 hover:text-white hover:bg-green-800'
                  }`}
                onClick={() => {
                  setActiveItem(item.id);
                  setIsOpen(false);
                }}
              >
                {item.icon}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            {!loggedIn && (
              <>
                <Link
                  key="signup"
                  href="/SignupPage"
                  className="flex items-center relative px-4 py-2 rounded-lg text-base font-medium transition-all overflow-hidden group text-green-200 hover:text-white hover:bg-green-800"
                  onClick={() => {
                    setActiveItem('signup');
                    setIsOpen(false);
                  }}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span className="relative z-10">Sign Up</span>
                </Link>
                <Link
                  key="login"
                  href="/LoginPage"
                  className="flex items-center relative px-4 py-2 rounded-lg text-base font-medium transition-all overflow-hidden group text-green-200 hover:text-white hover:bg-green-800"
                  onClick={() => {
                    setActiveItem('login');
                    setIsOpen(false);
                  }}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className="relative z-10">Login</span>
                </Link>
              </>
            )}
            {loggedIn && (
              <button
                onClick={handleSignOut}
                className="flex items-center relative px-4 py-2 rounded-lg text-base font-medium transition-all overflow-hidden group text-red-200 hover:text-white bg-red-700 mt-4"
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span className="relative z-10">Sign Out</span>
              </button>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
