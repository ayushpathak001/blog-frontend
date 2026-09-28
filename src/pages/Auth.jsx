import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import { Button, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authApi } from '../services/api';
import { errorMessage } from '../utils/helpers';

const Alert = ({ children, ok }) => <div className={`mb-4 rounded-xl p-3 text-sm font-medium ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{children}</div>;

export function Login() {
  const { login, sessionMessage, clearSessionMessage, isAuthenticated } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { push } = useToast();
  const [f, setF] = useState({ name: '', password: '', remember: true });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (isAuthenticated) nav('/', { replace: true }); }, [isAuthenticated, nav]);
  useEffect(() => () => clearSessionMessage(), []); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.password) return setErr('Please enter your name and password.');
    setLoading(true); setErr('');
    try {
      await login(f.name.trim(), f.password, f.remember);
      push('Welcome back!', 'success');
      nav('/', { replace: true }); // spec: redirect to Home after login
    } catch (x) {
      setErr(errorMessage(x, { 401: 'Incorrect name or password.', 403: 'Incorrect name or password.', 404: 'Incorrect name or password.' }));
    } finally { setLoading(false); }
  };
  const msg = sessionMessage || loc.state?.message;
  return (
    <AuthLayout title="Welcome back" subtitle="Log in with your name and password.">
      {msg && <Alert>{msg}</Alert>}
      {err && <Alert>{err}</Alert>}
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name" placeholder="Your name (not email)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="username" />
        <Input label="Password" type="password" placeholder="••••••••" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} className="accent-brand" />Remember me</label>
          <Link to="/forgot-password" className="font-semibold text-brand">Forgot password?</Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">Log in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">New here? <Link to="/register" className="font-semibold text-brand">Create an account</Link></p>
    </AuthLayout>
  );
}

export function Register() {
  const nav = useNavigate();
  const { push } = useToast();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errs, setErrs] = useState({});
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (!f.name.trim()) v.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) v.email = 'Enter a valid email address.';
    if (f.password.length < 6) v.password = 'Password must be at least 6 characters.';
    if (f.confirm !== f.password) v.confirm = 'Passwords do not match.';
    setErrs(v); setErr('');
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      await authApi.register({ name: f.name.trim(), email: f.email.trim(), password: f.password });
      push('Account created! Please log in.', 'success');
      nav('/login');
    } catch (x) {
      const detail = String(x.response?.data?.detail || '').toLowerCase();
      if (x.response?.status === 409) {
        if (detail.includes('email')) setErrs({ email: 'This email is already registered.' });
        else setErrs({ name: 'This name is already taken. Try another one.' });
      } else setErr(errorMessage(x));
    } finally { setLoading(false); }
  };
  return (
    <AuthLayout title="Create your account" subtitle="Start sharing your stories today.">
      {err && <Alert>{err}</Alert>}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Name" value={f.name} onChange={set('name')} error={errs.name} autoComplete="username" />
        <Input label="Email" type="email" value={f.email} onChange={set('email')} error={errs.email} autoComplete="email" />
        <Input label="Password" type="password" value={f.password} onChange={set('password')} error={errs.password} autoComplete="new-password" />
        <Input label="Confirm Password" type="password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} autoComplete="new-password" />
        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-semibold text-brand">Log in</Link></p>
    </AuthLayout>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ loading: false, err: '', done: false });
  const submit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState({ loading: false, err: 'Enter a valid email address.', done: false });
    setState({ loading: true, err: '', done: false });
    try { await authApi.forgotPassword(email.trim()); setState({ loading: false, err: '', done: true }); }
    catch (x) { setState({ loading: false, err: errorMessage(x, { 404: 'No account found with that email.' }), done: false }); }
  };
  return (
    <AuthLayout title="Forgot password?" subtitle="Enter your email and we'll send you a password reset link.">
      {state.err && <Alert>{state.err}</Alert>}
      {state.done && <Alert ok>Reset link sent. Check your inbox.</Alert>}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" loading={state.loading} className="w-full">Send reset link</Button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="font-semibold text-brand">Back to login</Link></p>
    </AuthLayout>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [f, setF] = useState({ password: '', confirm: '' });
  const [state, setState] = useState({ loading: false, err: '', done: false });
  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6) return setState({ ...state, err: 'Password must be at least 6 characters.' });
    if (f.password !== f.confirm) return setState({ ...state, err: 'Passwords do not match.' });
    setState({ loading: true, err: '', done: false });
    try { await authApi.resetPassword(token, f.password); setState({ loading: false, err: '', done: true }); }
    catch (x) { setState({ loading: false, err: errorMessage(x, { 401: 'This reset link is invalid or expired.', 400: 'This reset link is invalid or expired.', 404: 'This reset link is invalid or expired.' }), done: false }); }
  };
  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account.">
      {!token && <Alert>This reset link is missing its token. Request a new one.</Alert>}
      {state.err && <Alert>{state.err}</Alert>}
      {state.done ? (
        <div className="text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><p className="mt-3 font-semibold">Password updated!</p><Link to="/login"><Button className="mt-5 w-full">Go to login</Button></Link></div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Input label="New password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <Input label="Confirm password" type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
          <Button type="submit" loading={state.loading} disabled={!token} className="w-full">Reset password</Button>
        </form>
      )}
    </AuthLayout>
  );
}
