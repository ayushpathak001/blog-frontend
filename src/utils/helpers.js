export const fmtDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  return isNaN(date) ? '' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
export const excerpt = (t = '', n = 140) => (t.length > n ? t.slice(0, n).trimEnd() + '…' : t);
export const initial = (name) => (name || '?').trim().charAt(0).toUpperCase();
const GRADS = ['from-blue-600 to-sky-400', 'from-indigo-700 to-blue-400', 'from-sky-500 to-cyan-300', 'from-navy to-blue-500', 'from-blue-500 to-indigo-300'];
export const gradientFor = (id = '') => GRADS[[...String(id)].reduce((a, c) => a + c.charCodeAt(0), 0) % GRADS.length];

// Centralized, user-friendly errors (never shows raw backend traces)
export function errorMessage(err, overrides = {}) {
  if (!err?.response) {
    return err?.code === 'ECONNABORTED'
      ? 'The server is taking too long to respond. Please try again.'
      : "Can't reach the server. Check your connection and try again.";
  }
  const s = err.response.status;
  if (overrides[s]) return overrides[s];
  const detail = err.response.data?.detail;
  const map = {
    400: 'That request was not valid.',
    401: 'You are not authorized to do that.',
    403: "You don't have permission to do that.",
    404: 'We could not find what you were looking for.',
    409: typeof detail === 'string' ? detail : 'That already exists.',
    422: 'Some fields are invalid. Please check and try again.',
  };
  return map[s] || 'Something went wrong on our side. Please try again shortly.';
}
