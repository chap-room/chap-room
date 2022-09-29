import styles from "./style.module.scss";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as LogoWithName } from "@chap-room/shared/assets/images/logoWithName.svg";
import { ReactComponent as ArrowForwardIcon } from "@chap-room/shared/assets/icons/arrowForward.svg";
import ButtonList from "@chap-room/shared/components/ButtonList";
import Button from "@chap-room/shared/components/Button";

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
      <div className={styles.Start}>
        <Link to="/" className={logoClassName.join(" ")}>
          <LogoWithName />
        </Link>
        {showBackButtonInMobile && (
          <Link to="/" className={styles.MobileBackButton}>
            <ArrowForwardIcon />
          </Link>
        )}
      </div>
      <div className={styles.Center}>
        {showNavMenuAndUser && (
          <div className={styles.NavLinks}>
            <NavLink to="/">خانه</NavLink>
            <NavLink to="/prices">تعرفه پرینت</NavLink>
            <NavLink to="/order">سفارش پرینت</NavLink>
            <NavLink to="/blog">وبلاگ</NavLink>
            <NavLink to="/contact-us">تماس با ما</NavLink>
          </div>
        )}
      </div>
      <div className={styles.End}>
        {showNavMenuAndUser && (
          <div className={styles.UserAuth}>
            <ButtonList>
              <Link to="/login">
                <Button>ورود</Button>
              </Link>
              <Link to="/signup">
                <Button varient="filled">ثبت نام</Button>
              </Link>
            </ButtonList>
          </div>
        )}
      </div>
    </div>
  );
}
