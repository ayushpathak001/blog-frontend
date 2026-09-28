import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, Eye, Heart, MessageCircle, Pencil, Share2, Trash2, FileText } from 'lucide-react';
import { blogApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, ConfirmDelete, Input, Textarea } from '../components/ui';
import { EmptyState, ErrorState, PageLoader } from '../components/States';
import { ProfileAvatar } from '../components/Navbar';
import { errorMessage, fmtDate, gradientFor } from '../utils/helpers';

export function BlogDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const { push } = useToast();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const load = () => { setError(''); setBlog(null); blogApi.get(id).then(setBlog).catch((e) => setError(errorMessage(e, { 404: 'This blog does not exist or was deleted.', 422: 'This blog does not exist or was deleted.' }))); };
  useEffect(load, [id]); // eslint-disable-line

  const remove = async () => {
    setBusy(true);
    try { await blogApi.remove(id); push('Blog deleted', 'success'); nav('/my-blogs'); }
    catch (e) { push(errorMessage(e, { 401: 'Only the author can delete this blog.' }), 'error'); setConfirm(false); }
    finally { setBusy(false); }
  };
  const soon = (n) => () => push(`${n} isn't available yet — coming soon!`, 'info');
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); push('Link copied to clipboard', 'success'); } catch { push('Could not copy link', 'error'); } };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!blog) return <PageLoader />;
  const mine = user?.name && blog.author_name === user.name;
  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-brand"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className={`h-40 rounded-3xl bg-gradient-to-br ${gradientFor(blog._id)}`} />
      <div className="-mt-8 rounded-3xl bg-white p-6 shadow-card sm:p-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{blog.title}</h1>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><ProfileAvatar name={blog.author_name} /><div className="text-sm"><p className="font-bold">{blog.author_name}</p><p className="text-slate-500">{fmtDate(blog.created_at)}</p></div></div>
          {mine && <div className="flex gap-2"><Link to={`/edit/${blog._id}`}><Button variant="ghost"><Pencil className="h-4 w-4" />Edit</Button></Link><Button variant="outline" onClick={() => setConfirm(true)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>}
        </div>
        <p className="mt-8 whitespace-pre-wrap text-lg leading-8 text-slate-700">{blog.body}</p>
        {/* UI-only: no backend endpoints exist for these yet */}
        <div className="mt-10 flex gap-2 border-t border-slate-100 pt-5">
          {[[Heart, 'Like'], [MessageCircle, 'Comment'], [Bookmark, 'Save']].map(([I, l]) => <Button key={l} variant="ghost" onClick={soon(l)}><I className="h-4 w-4" />{l}</Button>)}
          <Button variant="ghost" onClick={share}><Share2 className="h-4 w-4" />Share</Button>
        </div>
      </div>
      <ConfirmDelete open={confirm} onClose={() => setConfirm(false)} onConfirm={remove} loading={busy} />
    </article>
  );
}

export function BlogEditor() {
  const { id } = useParams(); // present => edit mode
  const nav = useNavigate();
  const { push } = useToast();
  const [f, setF] = useState({ title: '', body: '' });
  const [errs, setErrs] = useState({});
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [loadErr, setLoadErr] = useState('');

  useEffect(() => {
    if (!id) return;
    blogApi.get(id).then((b) => setF({ title: b.title, body: b.body })).catch((e) => setLoadErr(errorMessage(e, { 404: 'Blog not found.' }))).finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (!f.title.trim()) v.title = 'Title is required.';
    if (!f.body.trim()) v.body = 'Write something first.';
    setErrs(v);
    if (Object.keys(v).length) return;
    setSaving(true);
    try {
      const payload = { title: f.title.trim(), body: f.body.trim() }; // backend accepts only title + body
      const res = id ? await blogApi.update(id, payload) : await blogApi.create(payload);
      push(id ? 'Blog updated' : 'Blog published!', 'success');
      nav(`/blog/${res?._id || id}`);
    } catch (x) { push(errorMessage(x, { 401: 'You can only edit your own blogs.', 404: 'Blog not found.' }), 'error'); }
    finally { setSaving(false); }
  };

  if (loadErr) return <ErrorState message={loadErr} />;
  if (loading) return <PageLoader />;
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-extrabold">{id ? 'Edit blog' : 'Create a new blog'}</h1>
      <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-6 shadow-card sm:p-8" noValidate>
        <Input label="Title" placeholder="An interesting title…" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={errs.title} />
        {preview ? (
          <div className="min-h-[260px] rounded-xl border border-slate-200 bg-canvas p-5"><h2 className="text-2xl font-extrabold">{f.title || 'Untitled'}</h2><p className="mt-4 whitespace-pre-wrap leading-7">{f.body || 'Nothing to preview yet.'}</p></div>
        ) : (
          <Textarea label="Body" rows={12} placeholder="Start writing your story…" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} error={errs.body} />
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">{f.body.length} characters · {f.body.trim() ? f.body.trim().split(/\s+/).length : 0} words</span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setPreview(!preview)}><Eye className="h-4 w-4" />{preview ? 'Edit' : 'Preview'}</Button>
            <Button type="submit" loading={saving}>{id ? 'Save changes' : 'Publish'}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

