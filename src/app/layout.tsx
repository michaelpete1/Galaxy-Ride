import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Galaxy Ride',
  description: 'Book or cancel a ride with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-20 px-6">{children}</main>
      </body>
    </html>
  );
}
