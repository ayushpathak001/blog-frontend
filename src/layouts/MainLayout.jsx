import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, MobileNavbar } from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [waking, setWaking] = useState(false);
  useEffect(() => {
    const h = (e) => setWaking(e.detail);
    window.addEventListener('api:wake', h);
    return () => window.removeEventListener('api:wake', h);
  }, []);
  return (
    <div className="min-h-screen">
      <Navbar />
      {waking && <div className="bg-navy py-2 text-center text-sm font-medium text-white">Server is waking up. Please wait a moment...</div>}
      <main className="mx-auto max-w-7xl px-4 py-8"><Outlet /></main>
      <Footer />
      <MobileNavbar />
    </div>
  );
}
