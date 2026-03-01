import { Link } from 'react-router';

function SidebarNav() {
  return (
    <aside>
      <Link to={'/'}>Home</Link>
      <Link to={'/journal'}>Journal</Link>
      <Link to={'/lists'}>Listen List</Link>
      <Link to={'/account'}>Account</Link>
    </aside>
  );
}

export default SidebarNav;
