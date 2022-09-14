import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as LogoWithName } from "../../assets/images/logoWithName.svg";
import Button from "../../components/Button";

export default function NotFound() {
  return (
    <div className={styles.NotFound}>
      <div className={styles.Header}>
        <Link to="/" className={styles.Logo}>
          <LogoWithName />
        </Link>
      </div>
      <div className={styles.Content}>
        <div className={styles.ErrorNumber}>404</div>
        <h1>این صفحه در دسترس نیست</h1>
        <p>
          این صفحه موجود نیست یا پاک شده است!
          <br />
          پیشنهاد می‌کنیم به صفحه اصلی برگردید.
        </p>
        <div className={styles.Buttons}>
          <Link to="/">
            <Button varient="filled">بازگشت به چاپ روم</Button>
          </Link>
          <Link to="/contact-us">
            <Button varient="outlined">تماس با ما</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
