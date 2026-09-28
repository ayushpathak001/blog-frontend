import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, FileText, Flame, Layers, PenSquare, Search } from 'lucide-react';
import useBlogs from '../hooks/useBlogs';
import { BlogFeed } from '../components/BlogCard';
import { EmptyState, ErrorState, SkeletonGrid } from '../components/States';
import { Button } from '../components/ui';

const Hero = () => (
  <section className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-blue-800 to-brand p-8 text-white shadow-card sm:p-12">
    <h1 className="max-w-xl text-3xl font-extrabold leading-tight sm:text-5xl">Stories worth sharing, all in one place.</h1>
    <p className="mt-3 max-w-lg text-blue-100">Read the latest posts from our community or publish your own.</p>
    <Link to="/create"><Button className="mt-6 !bg-white !text-brand hover:!bg-blue-50"><PenSquare className="h-4 w-4" />Start writing</Button></Link>
  </section>
);

function Section({ blogs, loading, error, reload }) {
  if (loading) return <SkeletonGrid />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!blogs.length) return <EmptyState icon={FileText} title="No blogs yet" text="Be the first to publish something." action={<Link to="/create"><Button>Create Blog</Button></Link>} />;
  return <BlogFeed blogs={blogs} />;
}

export function HomePage() {
  const s = useBlogs({ limit: 30, orderby: 'created_at' });
  return (<><Hero /><h2 className="mb-5 text-2xl font-extrabold">Latest stories</h2><Section {...s} /></>);
}

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [sort, setSort] = useState('new');
  const [author, setAuthor] = useState('all');
  const s = useBlogs();
  const authors = useMemo(() => [...new Set(s.blogs.map((b) => b.author_name))], [s.blogs]);
  const shown = useMemo(() => {
    let l = s.blogs.filter((b) => (author === 'all' || b.author_name === author) && `${b.title} ${b.body} ${b.author_name}`.toLowerCase().includes(q.toLowerCase()));
    l = [...l].sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'old' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));
    return l;
  }, [s.blogs, q, sort, author]);
  const sel = 'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand';
  return (
    <>
      <h1 className="mb-5 flex items-center gap-2 text-3xl font-extrabold"><Compass className="text-brand" />Explore</h1>
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {})} placeholder="Search title, content or author" className={`${sel} w-full pl-9`} /></div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}><option value="new">Newest</option><option value="old">Oldest</option><option value="title">Title A–Z</option></select>
        <select value={author} onChange={(e) => setAuthor(e.target.value)} className={sel}><option value="all">All authors</option>{authors.map((a) => <option key={a}>{a}</option>)}</select>
      </div>
      {!s.loading && !s.error && s.blogs.length > 0 && !shown.length
        ? <EmptyState icon={Search} title="No results" text="Try a different search or filter." />
        : <Section {...s} blogs={shown} />}
    </>
  );
}

export function DiscoverPage({ kind }) {
  const s = useBlogs({ limit: 12, orderby: 'created_at' });
  const trending = kind === 'trending';
  return (
    <>
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-extrabold">{trending ? <Flame className="text-brand" /> : <Layers className="text-brand" />}{trending ? 'Trending' : 'Categories'}</h1>
      <p className="mb-6 rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand">More discovery features coming soon. Meanwhile, here are the latest posts.</p>
      {!trending && <div className="mb-6 flex flex-wrap gap-2">{['Technology', 'Lifestyle', 'Travel', 'Food', 'Education', 'Health'].map((c) => <span key={c} className="cursor-not-allowed rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-400 shadow-sm">{c}</span>)}</div>}
      <Section {...s} />
    </>
  );
}
