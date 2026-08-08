import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects signed-out visitors to Sign In; shows nothing while the
// initial auth check (validating a stored token) is in flight.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
