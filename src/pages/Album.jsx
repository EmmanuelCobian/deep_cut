import { useParams } from 'react-router';

function Album() {
  const { albumId } = useParams();
  return <p>{albumId}</p>;
}

export default Album;
