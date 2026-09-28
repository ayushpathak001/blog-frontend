import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProfileAvatar } from './Navbar';
import { excerpt, fmtDate, gradientFor } from '../utils/helpers';

export function BlogCard({ blog }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`h-32 bg-gradient-to-br ${gradientFor(blog._id)} p-4`}>
        <div className="flex items-center gap-2 text-white">
          <ProfileAvatar name={blog.author_name} size="sm" ring />
          <div className="text-xs leading-tight"><p className="font-semibold">{blog.author_name}</p><p className="opacity-80">{fmtDate(blog.created_at)}</p></div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold">{blog.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{excerpt(blog.body)}</p>
        <Link to={`/blog/${blog._id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Read More <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function BlogFeed({ blogs }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{blogs.map((b) => <BlogCard key={b._id} blog={b} />)}</div>;
}
