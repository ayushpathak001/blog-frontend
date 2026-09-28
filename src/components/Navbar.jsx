import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Bookmark, Compass, Home, KeyRound, LogOut, PenSquare, Search, Settings, User, FileText, Plus } from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { initial } from '../utils/helpers';
import { Button } from './ui';

export function ProfileAvatar({ name, size = 'md', ring }) {
  const s = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-28 w-28 text-4xl' }[size];
  return (
    <div className={`${s} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-navy font-bold text-white ${ring ? 'ring-2 ring-white/70' : ''}`}>
      {initial(name)}
    </div>
  );
}

function useOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && cb();
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

export function SearchBar() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); nav(`/explore?q=${encodeURIComponent(q)}`); }} className="relative hidden xl:block">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search blogs"
        className="w-48 rounded-full bg-canvas py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand/30" />
    </form>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-brand-light" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-6 text-center shadow-2xl ring-1 ring-slate-100">
          <Bell className="mx-auto h-8 w-8 text-blue-300" />
          <p className="mt-2 font-semibold">No notifications yet.</p>
          <p className="text-xs text-slate-500">Notifications will appear here once available.</p>
        </div>
      )}
    </div>
  );
}

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useOutside(ref, () => setOpen(false));
  const items = [
    [User, 'Profile', '/profile'], [FileText, 'My Blogs', '/my-blogs'], [Bookmark, 'Saved Blogs', '/saved'],
    [Settings, 'Settings', '/settings'], [KeyRound, 'Change Password', '/change-password'],
  ];
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Account menu" className="rounded-full ring-2 ring-brand/30 transition hover:ring-brand"><ProfileAvatar name={user?.name} /></button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-3 pb-2 pt-1 text-sm font-bold">{user?.name}</div>
          {items.map(([Icon, label, to]) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-brand-light"><Icon className="h-4 w-4 text-brand" />{label}</Link>
          ))}
          <button onClick={() => { logout(); nav('/'); push('Logged out', 'info'); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />Logout</button>
        </div>
      )}
    </div>
  );
}

const links = [['/', 'Home'], ['/explore', 'Explore'], ['/trending', 'Trending'], ['/categories', 'Categories']];

export function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2"><img src={logo} alt="My Blog" className="h-11 w-auto object-contain" /><span className="hidden font-extrabold text-navy sm:block">My Blog</span></Link>
        <nav className="hidden gap-1 md:flex">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-brand-light text-brand' : 'text-slate-600 hover:bg-canvas'}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SearchBar />
          <Notifications />
          {isAuthenticated ? (
            <>
              <Link to="/create" className="hidden sm:block"><Button><PenSquare className="h-4 w-4" />Create Blog</Button></Link>
              <ProfileDropdown />
            </>
          ) : (
            <><Link to="/login"><Button variant="outline">Log in</Button></Link><Link to="/register" className="hidden sm:block"><Button>Sign up</Button></Link></>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileNavbar() {
  const { isAuthenticated } = useAuth();
  const items = [[Home, 'Home', '/'], [Compass, 'Explore', '/explore'], [Plus, 'Create', '/create'], [Bell, 'Alerts', '/notifications'], [User, 'Profile', isAuthenticated ? '/profile' : '/login']];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-blue-100 bg-white/95 py-2 backdrop-blur md:hidden">
      {items.map(([Icon, label, to]) => (
        <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 px-3 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-slate-500'}`}>
          {label === 'Create' ? <span className="-mt-5 rounded-full bg-brand p-3 text-white shadow-lg shadow-brand/40"><Icon className="h-5 w-5" /></span> : <Icon className="h-5 w-5" />}
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
