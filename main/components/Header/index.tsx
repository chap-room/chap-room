import styles from "./style.module.scss";
import { useState } from "react";
import Link from "next/link";
import ProfileIcon from "@/main/assets/icons/profile.svg";
import MenuIcon from "@/main/assets/icons/menu.svg";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import NavLink from "@/shared/components/NavLink";
import IconButton from "@/shared/components/IconButton";

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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logoClassName = [styles.Logo];
  if (hideLogoInMobile) {
    logoClassName.push(styles.HideLogoInMobile);
  }

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.Start}>
          {showNavMenuAndUser && (
            <button
              className={styles.MobileMenuToggle}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <MenuIcon />
            </button>
          )}
          {showNavMenuAndUser && (
            <div className={styles.MobileMenu} data-show={showMobileMenu}>
              <NavLinks />
            </div>
          )}
          <Link href="/">
            <a className={logoClassName.join(" ")}>
              <LogoWithName />
            </a>
          </Link>
          {showBackButtonInMobile && (
            <Link href="/">
              <a className={styles.MobileBackButton}>
                <ArrowForwardIcon />
              </a>
            </Link>
          )}
        </div>
        <div className={styles.Center}>
          {showNavMenuAndUser && <NavLinks />}
        </div>
        <div className={styles.End}>
          {showNavMenuAndUser && (
            <div className={styles.UserAuth}>
              <ButtonList>
                <Link href="/login">
                  <Button>ورود</Button>
                </Link>
                <Link href="/register">
                  <Button varient="filled">ثبت نام</Button>
                </Link>
              </ButtonList>
            </div>
          )}
          {showNavMenuAndUser && (
            <div className={styles.UserMobile}>
              <Link href="/login">
                <IconButton size={48}>
                  <ProfileIcon width={28} height={28} />
                </IconButton>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NavLinks() {
  return (
    <div className={styles.NavLinks}>
      <NavLink href="/" end>
        <a>خانه</a>
      </NavLink>
      <NavLink href="/prices" end>
        <a>تعرفه پرینت</a>
      </NavLink>
      {/* <NavLink href="/blog" end>
        <a>وبلاگ</a>
      </NavLink> */}
      <NavLink href="/contact-us" end>
        <a>تماس با ما</a>
      </NavLink>
      <NavLink href="/about-us" end>
        <a>درباره ما</a>
      </NavLink>
      <NavLink href="/work-with-us" end>
        <a>همکاری با ما</a>
      </NavLink>
    </div>
  );
}
