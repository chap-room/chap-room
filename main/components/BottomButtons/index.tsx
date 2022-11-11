import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/main/api";
import NavLink from "@/shared/components/NavLink";
import OrdersIcon from "@/shared/assets/icons/orders.svg";
import Logo from "@/shared/assets/images/logo.svg";
import PricesIcon from "@/shared/assets/icons/money.svg";
import { useRouter } from "next/router";

export default function BottomButtons() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

  useEffect(() => {
    if (router.asPath === "/auth") return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "");
      if (userData) setIsUserLoggedIn(true);
    } catch {}

    isLoggedIn()
      .then((userData) => setIsUserLoggedIn(!!userData))
      .catch(() => {});
  }, []);

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.BottomButtons}>
          <NavLink
            href={isUserLoggedIn ? "/dashboard/orders/new" : "/auth"}
            end
          >
            <div className={styles.NavLink}>
              <OrdersIcon />
              <div>سفارش پرینت</div>
            </div>
          </NavLink>
          <NavLink href="/" end>
            <div className={styles.NavLink}>
              <Logo />
              <div>چاپ روم</div>
            </div>
          </NavLink>
          <NavLink href="/tariffs" end>
            <div className={styles.NavLink}>
              <PricesIcon />
              <div>تعرفه پرینت</div>
            </div>
          </NavLink>
        </div>
      </div>
      <div className={styles.Placeholder} />
    </>
  );
}
