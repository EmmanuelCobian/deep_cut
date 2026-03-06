import { Navigate } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import Loading from './Loading';

function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  return children;
}

export default AuthGuard;
