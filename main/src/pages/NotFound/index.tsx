import styles from "./style.module.scss";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ReactComponent as LogoWithName } from "@chap-room/shared/assets/images/logoWithName.svg";
import Button from "@chap-room/shared/components/Button";

export default function NotFound() {
  return (
    <div className={styles.NotFound}>
      <Helmet title="صفحه مورد نظر شما وجود ندارد" />
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
            <Button varient="gradient">بازگشت به چاپ روم</Button>
          </Link>
          <Link to="/contact-us">
            <Button varient="outlined">تماس با ما</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
