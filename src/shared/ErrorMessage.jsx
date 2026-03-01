import { Link } from 'react-router';

function ErrorMessage({ error }) {
  return (
    <div>
      <p>{error}</p>
      <Link to={'/'}>Go back home</Link>
    </div>
  );
}

export default ErrorMessage;
