import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import supabase from '../lib/utils/supabase';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (!token_hash) {
      navigate('/', { replace: true });
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash, type: type ?? 'email' })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          navigate('/', { replace: true });
        }
      });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div>
        <h1>Authentication failed</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login', { replace: true })}>
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Signing you in...</h1>
      <p>Confirming your magic link, hang tight.</p>
    </div>
  );
}

export default AuthCallback;
