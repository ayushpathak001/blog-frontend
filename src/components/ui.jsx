import { Loader2, X } from 'lucide-react';

export function Button({ variant = 'primary', loading, className = '', children, ...p }) {
  const v = {
    primary: 'bg-brand text-white hover:bg-brand-dark shadow-sm shadow-brand/30',
    ghost: 'bg-brand-light text-brand hover:bg-blue-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-slate-200 bg-white text-navy hover:bg-slate-50',
  }[variant];
  return (
    <button {...p} disabled={loading || p.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${v} ${className}`}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

const field = 'w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10';
export function Input({ label, error, className = '', ...p }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold">{label}</span>}
      <input {...p} className={`${field} ${error ? 'border-red-400' : 'border-slate-200'} ${className}`} />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
export function Textarea({ label, error, className = '', ...p }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-semibold">{label}</span>}
      <textarea {...p} className={`${field} ${error ? 'border-red-400' : 'border-slate-200'} ${className}`} />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-navy/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDelete({ open, onClose, onConfirm, loading }) {
  return (
    <Modal open={open} onClose={onClose} title="Delete blog">
      <p className="text-sm text-slate-600">Are you sure you want to delete this blog?</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  );
}
