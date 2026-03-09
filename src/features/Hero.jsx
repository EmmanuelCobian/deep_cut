import { Link } from 'react-router';
import styles from './Hero.module.css';

function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroText}>
        <p className={styles.eyebrow}>Welcome to Deep Cut!</p>
        <h1 className={styles.heroTitle}>
          <em>Your</em> story.
          <br />
          <em>Your</em> words.
        </h1>
        <p className={styles.heroSubtitle}>
          This is a listening journal for people who love music and want to
          document their listening experiences. Rate tracks, write thoughts, and
          build a personal archive of every song and album you've heard.
        </p>
        <Link to="/login" className={styles.heroButton}>
          Start listening
        </Link>
      </div>
    </div>
  );
}

export default Hero;
