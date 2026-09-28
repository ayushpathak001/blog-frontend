import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AuthLayout({ title, subtitle, children }) {
  const [waking, setWaking] = useState(false);
  useEffect(() => {
    const h = (e) => setWaking(e.detail);
    window.addEventListener('api:wake', h);
    return () => window.removeEventListener('api:wake', h);
  }, []);
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-navy via-blue-900 to-brand p-12 text-white lg:flex">
        <Link to="/" className="inline-block w-fit rounded-2xl bg-white p-2"><img src={logo} alt="My Blog" className="h-12" /></Link>
        <div><h2 className="text-4xl font-extrabold leading-tight">Write. Share.<br />Inspire.</h2><p className="mt-3 max-w-sm text-blue-100">Your stories deserve a beautiful home. Join the community and start publishing.</p></div>
        <p className="text-sm text-blue-200">© My Blog</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 block lg:hidden"><img src={logo} alt="My Blog" className="h-14" /></Link>
          {waking && <div className="mb-4 rounded-xl bg-brand-light p-3 text-sm font-medium text-brand">Server is waking up. Please wait a moment...</div>}
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mb-6 mt-1 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
