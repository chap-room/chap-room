import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileIcon from "@/main/assets/icons/profile.svg";
import MenuIcon from "@/main/assets/icons/menu.svg";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import NavLink from "@/shared/components/NavLink";
import IconButton from "@/shared/components/IconButton";
import { isLoggedIn } from "@/main/api";
import Avatar from "@/shared/components/Dashboard/Avatar";

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
  const [user, setUser] = useState<{
    avatar: string | null;
    name: string;
  } | null>(null);

  useEffect(() => {
    isLoggedIn()
      .then(setUser)
      .catch(() => {});
  }, []);

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
          {showNavMenuAndUser &&
            (user === null ? (
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
            ) : (
              <Link href="/dashboard">
                <div className={styles.User}>
                  <div className={styles.UserAvatar}>
                    <Avatar user={user} />
                  </div>
                  <div>{user.name}</div>
                </div>
              </Link>
            ))}
          {showNavMenuAndUser && (
            <div className={styles.UserMobile}>
              <Link href={user === null ? "/login" : "/dashboard"}>
                {user === null ? (
                  <div className={styles.LoginButton}>
                    <IconButton size={48}>
                      <ProfileIcon />
                    </IconButton>
                  </div>
                ) : (
                  <div className={styles.UserAvatar}>
                    <Avatar user={user} />
                  </div>
                )}
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
      <NavLink href="/tariffs" end>
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
