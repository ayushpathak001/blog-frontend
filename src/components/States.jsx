import { AlertTriangle, Inbox } from 'lucide-react';
import { Button } from './ui';

export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-xl bg-blue-100/70 ${className}`} />;

export function BlogSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <Skeleton className="h-32 rounded-none" />
      <div className="space-y-3 p-5"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-6 w-4/5" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div>
    </div>
  );
}
export const SkeletonGrid = ({ n = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: n }).map((_, i) => <BlogSkeleton key={i} />)}</div>
);
export const PageLoader = () => <div className="mx-auto max-w-3xl space-y-4 py-10"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-64" /></div>;

export function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-blue-200 bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-brand-light p-4 text-brand"><Icon className="h-8 w-8" /></div>
      <h3 className="text-lg font-bold">{title}</h3>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function ErrorState({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl bg-white px-6 py-12 text-center shadow-card">
      <div className="mb-4 rounded-2xl bg-red-50 p-4 text-red-500"><AlertTriangle className="h-8 w-8" /></div>
      <h3 className="text-lg font-bold">Something went wrong</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      {onRetry && <Button className="mt-5" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
