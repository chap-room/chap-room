import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { logout } from "@/main/api";
import { useUserData } from "@/main/context/userData";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import { DataLoaderView } from "@/shared/components/DataLoader";
import LogoWithName from "@/shared/assets/images/logoWithName.svg";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import NavLink from "@/shared/components/NavLink";
import IconButton from "@/shared/components/IconButton";
import ProfileFilledIcon from "@/main/assets/icons/personFilled.svg";
import ExpandMoreIcon from "@/shared/assets/icons/expandMore.svg";
import DashboardIcon from "@/shared/assets/icons/dashboard.svg";
import LogoutIcon from "@/shared/assets/icons/logout.svg";
import Avatar from "@/shared/components/Dashboard/Avatar";

export default function Header() {
  const userData = useUserData();
  const router = useRouter();

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => setIsFirstRender(false), []);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.Start}>
          <Link href="/">
            <a className={styles.Logo}>
              <LogoWithName />
            </a>
          </Link>
        </div>
        <div className={styles.Center}>
          <div className={styles.NavLinks}>
            <NavLink href="/" end>
              <a>خانه</a>
            </NavLink>
            <NavLink href="/tariffs" end>
              <a>تعرفه و سفارش پرینت</a>
            </NavLink>
            <NavLink href="/about-us" end>
              <a>درباره ما</a>
            </NavLink>
            <NavLink href="/contact-us" end>
              <a>تماس با ما</a>
            </NavLink>
            <NavLink href="/work-with-us" end>
              <a>همکاری با ما</a>
            </NavLink>
          </div>
        </div>
        <div className={styles.End}>
          {!isFirstRender && (
            <DataLoaderView
              state={
                userData.value !== null
                  ? {
                      isLoading: false,
                      isError: false,
                      reload: userData.loaderState.reload,
                    }
                  : userData.loaderState
              }
              size="small"
            >
              {userData.value === null ? (
                <>
                  <div className={styles.UserAuth}>
                    <ButtonList>
                      <Link href="/login">
                        <Button>
                          <ProfileFilledIcon /> ورود
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button varient="filled">ثبت نام</Button>
                      </Link>
                    </ButtonList>
                  </div>
                  <div className={styles.UserAuthMobile}>
                    <Link href="/auth">
                      <div className={styles.LoginButton}>
                        <IconButton size={54}>
                          <ProfileFilledIcon />
                        </IconButton>
                        وارد حساب کاربری خود شوید!
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.User}>
                    <div className={styles.Avatar}>
                      <ProfileFilledIcon />
                    </div>
                    <div className={styles.MenuContainer}>
                      <div
                        className={styles.Menu}
                        data-is-open={isUserMenuOpen}
                      >
                        <button
                          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                          <ExpandMoreIcon />
                          <span>{userData.value.name}</span>
                        </button>
                        <Link href="/dashboard">
                          <button>
                            <DashboardIcon /> مشاهده حساب کاربری
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            router.reload();
                          }}
                        >
                          <LogoutIcon /> خروج
                        </button>
                      </div>
                    </div>
                  </div>
                  <Link href="/dashboard">
                    <div className={styles.UserMobile}>
                      <Avatar user={userData.value} />
                      <div className={styles.Meta}>
                        <div className={styles.PhoneNumber}>
                          {englishToPersianNumbers(userData.value.phoneNumber)}
                        </div>
                        <div className={styles.Name}>{userData.value.name}</div>
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </DataLoaderView>
          )}
        </div>
      </div>
    </>
  );
}
