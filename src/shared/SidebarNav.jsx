import { Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';
import styles from './SidebarNav.module.css';

function SidebarNav() {
  const { user, signOut } = useAuth();
  return (
    <aside>
      <Link to="/">Home</Link>
      <Link to="/journal">Journal</Link>
      <Link to="/lists">Listen List</Link>
      {user ? (
        <button onClick={signOut}>Log out</button>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </aside>
  );
}

export default SidebarNav;
