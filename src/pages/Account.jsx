import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Bookmark, Eye, FileText, KeyRound, Pencil, PenSquare, Settings, Trash2 } from 'lucide-react';
import useBlogs from '../hooks/useBlogs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { blogApi } from '../services/api';
import { Button, ConfirmDelete } from '../components/ui';
import { BlogFeed } from '../components/BlogCard';
import { EmptyState, ErrorState, SkeletonGrid, Skeleton } from '../components/States';
import { ProfileAvatar } from '../components/Navbar';
import { errorMessage, fmtDate } from '../utils/helpers';

// The backend has no "my blogs" endpoint: fetch GET /blog and filter by the signed-in name.
function useMine() {
  const { user } = useAuth();
  const s = useBlogs();
  return { ...s, mine: s.blogs.filter((b) => b.author_name === user?.name) };
}

export function MyBlogsPage() {
  const { mine, setBlogs, loading, error, reload } = useMine();
  const { push } = useToast();
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const remove = async () => {
    setBusy(true);
    try { await blogApi.remove(target._id); setBlogs((l) => l.filter((b) => b._id !== target._id)); push('Blog deleted', 'success'); }
    catch (e) { push(errorMessage(e, { 401: 'Only the author can delete this blog.', 404: 'This blog no longer exists.' }), 'error'); }
    finally { setBusy(false); setTarget(null); }
  };
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between"><h1 className="text-3xl font-extrabold">My Blogs</h1><Link to="/create"><Button><PenSquare className="h-4 w-4" />New</Button></Link></div>
      {loading ? <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>
        : error ? <ErrorState message={error} onRetry={reload} />
        : !mine.length ? <EmptyState icon={FileText} title="No blogs yet" text="You haven't published anything yet." action={<Link to="/create"><Button>Write your first blog</Button></Link>} />
        : <div className="space-y-3">{mine.map((b) => (
          <div key={b._id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
            <div className="min-w-0"><p className="truncate font-bold">{b.title}</p><p className="text-xs text-slate-500">{fmtDate(b.created_at)}</p></div>
            <div className="flex shrink-0 gap-1">
              <Link to={`/blog/${b._id}`} className="rounded-lg p-2 text-brand hover:bg-brand-light" title="View"><Eye className="h-4 w-4" /></Link>
              <Link to={`/edit/${b._id}`} className="rounded-lg p-2 text-brand hover:bg-brand-light" title="Edit"><Pencil className="h-4 w-4" /></Link>
              <button onClick={() => setTarget(b)} className="rounded-lg p-2 text-red-500 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>))}</div>}
      <ConfirmDelete open={!!target} onClose={() => setTarget(null)} onConfirm={remove} loading={busy} />
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const { mine, loading, error, reload } = useMine();
  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="h-32 bg-gradient-to-r from-navy via-blue-700 to-sky-400" />
        <div className="px-6 pb-6 sm:px-10">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
            <div className="rounded-full ring-4 ring-white"><ProfileAvatar name={user?.name} size="lg" /></div>
            <Button variant="outline" disabled title="Profile editing API coming soon">Edit profile</Button>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold">{user?.name}</h1>
          <p className="text-sm text-slate-500">Email isn't available after login (no profile API yet).</p>
          <p className="mt-3 rounded-xl bg-canvas p-3 text-sm text-slate-500">Bio — profile editing API coming soon.</p>
          <div className="mt-4 flex gap-8 text-center"><div><p className="text-xl font-extrabold">{loading ? '–' : mine.length}</p><p className="text-xs text-slate-500">Blogs</p></div>
            {['Followers', 'Following'].map((l) => <div key={l} className="opacity-40"><p className="text-xl font-extrabold">–</p><p className="text-xs">{l}</p></div>)}</div>
        </div>
      </div>
      <h2 className="mb-4 mt-8 text-xl font-extrabold">Your blogs</h2>
      {loading ? <SkeletonGrid n={3} /> : error ? <ErrorState message={error} onRetry={reload} />
        : mine.length ? <BlogFeed blogs={mine} /> : <EmptyState icon={FileText} title="No blogs yet" text="Your published blogs will show up here." action={<Link to="/create"><Button>Create Blog</Button></Link>} />}
    </div>
  );
}

const SOON = {
  saved: [Bookmark, 'Saved Blogs', 'No saved posts yet. Saving blogs is coming soon.'],
  settings: [Settings, 'Settings', 'Account settings are coming soon.'],
  'change-password': [KeyRound, 'Change Password', 'Changing your password while logged in is coming soon. You can use "Forgot password" on the login page for now.'],
  notifications: [Bell, 'Notifications', 'No notifications yet.'],
};
export function ComingSoon({ kind }) {
  const [Icon, title, text] = SOON[kind];
  return <EmptyState icon={Icon} title={title} text={text} action={<Link to="/"><Button variant="ghost">Back to Home</Button></Link>} />;
}
