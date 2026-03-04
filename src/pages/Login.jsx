import { useState } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import supabase from '../lib/utils/supabase';
import CheckCircle from '../assets/check-circle.svg';
import styles from './Login.module.css';

function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (user) return <Navigate to={'/'} replace />;

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }

    setLoading(false);
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <img className={styles.icon} src={CheckCircle} />
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            We sent a magic link to{' '}
            <strong className={styles.emailHighlight}>{email}</strong>. Click it
            to sign in — no password needed.
          </p>
          <button
            className={styles.resendButton}
            onClick={() => setSubmitted(false)}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brandRow}>
          <span className={styles.brandName}>Deep Cut</span>
        </div>

        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>
          Enter your email and get a magic link to sign in instantly.
        </p>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              className={styles.input}
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            Send magic link
          </button>
        </form>

        <p className={styles.fine}>
          No account yet? Just enter your email — we'll create one
          automatically.
        </p>
      </div>
    </div>
  );
}

export default Login;
