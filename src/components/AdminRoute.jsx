import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';

// Gate admin-only routes. Assumes ProtectedRoute already ensured a user.
export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  // Wait for both the session and the admin-flag lookup (isAdmin === null).
  if (loading || (user && isAdmin === null)) {
    return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-prose px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Admins only</h1>
        <p className="mt-2 text-gray-600">This area is restricted to administrators.</p>
        <Navigate to="/dashboard" replace />
      </main>
    );
  }
  return children;
}
