import styles from "./style.module.scss";
import { ReactComponent as LogoWithName } from "../../assets/images/logoWithName.svg";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as ArrowForwardIcon } from "../../assets/icons/arrowForward.svg";

interface HeaderProps {
  showBackButtonInMobile?: boolean;
  hideLogoInMobile?: boolean;
  showNavMenuAndUser?: boolean;
}

export default function Header({
  showBackButtonInMobile = false,
  hideLogoInMobile = false,
  showNavMenuAndUser = false,
}: HeaderProps) {
  const logoClassName = [styles.Logo];
  if (hideLogoInMobile) {
    logoClassName.push(styles.HideLogoInMobile);
  }

  return (
    <div className={styles.Header}>
      <Link to="/" className={logoClassName.join(" ")}>
        <LogoWithName />
      </Link>
      {showBackButtonInMobile && (
        <Link to="/" className={styles.MobileBackButton}>
          <ArrowForwardIcon />
        </Link>
      )}
      {showNavMenuAndUser && (
        <>
          <div className={styles.NavLinks}>
            <NavLink to="/">خانه</NavLink>
            <NavLink to="/prices">تعرفه پرینت</NavLink>
            <NavLink to="/order">سفارش پرینت</NavLink>
            <NavLink to="/blog">وبلاگ</NavLink>
            <NavLink to="/contact-us">تماس با ما</NavLink>
          </div>
          <div className={styles.UserLogin}>
            <Link to="/login">ورود</Link>
            <Link to="/signup">ثبت نام</Link>
          </div>
        </>
      )}
    </div>
  );
}
