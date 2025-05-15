'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type NavItem = {
  id: string;
  label: string;
  href: string;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'signup', label: 'Sign Up', href: '/SignupPage' },
    { id: 'login', label: 'Login', href: '/LoginPage' },
    { id: 'request', label: 'Request Ride', href: '/RequestRide' },
    { id: 'cancel', label: 'Cancel Ride', href: '/CancelRide' },
    { id: 'profile', label: 'Profile', href: '/ProfilePage' },
  ];

  return (
    <nav
      className={`fixed w-full transition-all duration-300 z-50 ${
        isScrolled ? 'bg-[#1a365d] shadow-lg py-2' : 'bg-[#0f2747] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo as a link */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center transform transition-transform duration-300 hover:scale-110 cursor-pointer"
            onClick={() => setActiveItem('home')}
          >
            <span className="text-white font-bold text-xl tracking-tight">
              Galaxy<span className="text-blue-300">Ride</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeItem === item.id
                    ? 'text-white bg-navy-700'
                    : 'text-blue-200 hover:bg-navy-700 hover:text-white'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-navy-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1e3a5f]">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeItem === item.id
                  ? 'text-white bg-navy-700'
                  : 'text-blue-200 hover:bg-navy-700 hover:text-white'
              }`}
              onClick={() => {
                setActiveItem(item.id);
                setIsOpen(false); // close menu on click
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
