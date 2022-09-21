import styles from './style.module.scss';
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from '../../components/Header';

export default function Home() {
  return (
    <div className={styles.Home}>
      <Helmet title="صفحه اصلی" />
      <Header showNavMenuAndUser />
      <div className={styles.Content}>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
