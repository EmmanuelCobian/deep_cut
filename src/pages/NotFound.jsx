import { useNavigate } from 'react-router';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>404</h1>
      <p>Page not found</p>
      <button onClick={() => navigate('/', { replace: true })}>
        Go back home
      </button>
    </div>
  );
}

export default NotFound;
