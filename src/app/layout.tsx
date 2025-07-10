'use client';
import './globals.css';
import Navbar from './components/Navbar';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, '').toLowerCase();
  const hideNavbar =
    normalizedPath === '' || // homepage
    normalizedPath === '/' ||
    normalizedPath === '/loginpage' ||
    normalizedPath === '/signuppage' ||
    normalizedPath === '/forgotpassword' ||
    normalizedPath === '/resetpassword';
  return (
    <html lang="en">
      <body>
        {!hideNavbar && <Navbar />}
        <main className="pt-20 px-6">{children}</main>
      </body>
    </html>
  );
}
