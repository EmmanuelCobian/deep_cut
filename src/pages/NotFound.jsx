import { useNavigate } from 'react-router';
import styles from './NotFound.module.css';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.header}>404</h1>
      <p className={styles.text}>Page not found</p>
      <button
        className={styles.btn}
        onClick={() => navigate('/', { replace: true })}
      >
        Go back home
      </button>
    </div>
  );
}

export default NotFound;
