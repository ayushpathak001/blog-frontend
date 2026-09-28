import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Login, Register, ForgotPassword, ResetPassword } from './pages/Auth';
import { HomePage, ExplorePage, DiscoverPage } from './pages/Feed';
import { BlogDetail, BlogEditor } from './pages/BlogPages';
import { MyBlogsPage, ProfilePage, ComingSoon } from './pages/Account';
import { EmptyState } from './components/States';

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/trending" element={<DiscoverPage kind="trending" />} />
        <Route path="/categories" element={<DiscoverPage kind="categories" />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/notifications" element={<ComingSoon kind="notifications" />} />
        <Route path="/create" element={<P><BlogEditor /></P>} />
        <Route path="/edit/:id" element={<P><BlogEditor /></P>} />
        <Route path="/my-blogs" element={<P><MyBlogsPage /></P>} />
        <Route path="/profile" element={<P><ProfilePage /></P>} />
        <Route path="/saved" element={<P><ComingSoon kind="saved" /></P>} />
        <Route path="/settings" element={<P><ComingSoon kind="settings" /></P>} />
        <Route path="/change-password" element={<P><ComingSoon kind="change-password" /></P>} />
        <Route path="*" element={<EmptyState title="Page not found" text="That page doesn't exist." />} />
      </Route>
    </Routes>
  );
}
