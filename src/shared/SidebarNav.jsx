import { Link } from 'react-router';

function SidebarNav() {
  return (
    <aside>
      <Link to={'/'}>Home</Link>
      <Link to={'/'}>Journal</Link>
      <Link to={'/'}>Listen List</Link>
      <Link to={'/'}>Account</Link>
    </aside>
  );
}

export default SidebarNav;
