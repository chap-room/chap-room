import { Link } from 'react-router-dom';
import styles from './style.module.scss';

export default function NotFound() {
  return (
    <div>
      <h2>Error 404</h2>
      <h3>Page Not Found</h3>
      <Link to="/">Home</Link>
    </div>
  );
}
