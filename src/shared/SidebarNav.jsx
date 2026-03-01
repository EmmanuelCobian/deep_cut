import { Link } from 'react-router';
import { useAuth } from '../lib/context/AuthContext';

function SidebarNav() {
  const { user, signOut } = useAuth();
  return (
    <aside>
      <Link to="/">Home</Link>
      <Link to="/journal">Journal</Link>
      <Link to="/lists">Listen List</Link>
      {user ? (
        <div>
          <Link to="/account">Account</Link>
          <button onClick={signOut}>Log out</button>
        </div>
      ) : (
        <Link to="/login">Log in</Link>
      )}
    </aside>
  );
}

export default SidebarNav;
