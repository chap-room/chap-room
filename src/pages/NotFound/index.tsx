import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

export default function NotFound() {
  return (
    <div className={styles.NotFound}>
      <Header />
      <div className={styles.Content}>
        <div className={styles.ErrorNumber}>404</div>
        <h1>این صفحه در دسترس نیست</h1>
        <p>
          این صفحه موجود نیست یا پاک شده است!
          <br />
          پیشنهاد می‌کنیم به صفحه اصلی برگردید.
        </p>
        <div className={styles.Buttons}>
          <Link className={styles.BackButtons} to="/">بازگشت به چاپ روم</Link>
          <Link className={styles.ContactUsButtons} to="/contact-us">تماس با ما</Link>
        </div>
      </div>
    </div>
  );
}
