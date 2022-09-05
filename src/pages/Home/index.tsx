import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import styles from './style.module.scss';

export default function Home() {
  useEffect(() => {
    document.title = "صفحه اصلی";
  }, []);

  return <Link to="/dashboard">Dashboard</Link>;
}
