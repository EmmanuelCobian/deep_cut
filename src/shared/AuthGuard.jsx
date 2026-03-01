import { Navigate } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';

function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>loading...</div>;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return children;
}

export default AuthGuard;
