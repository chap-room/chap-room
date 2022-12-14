import styles from "./style.module.scss";
import Link from "next/link";
import { useUserData } from "@/main/context/userData";
import NavLink from "@/shared/components/NavLink";
import OrdersIcon from "@/shared/assets/icons/orders.svg";
import Logo from "@/shared/assets/images/logo.svg";
import PricesIcon from "@/shared/assets/icons/money.svg";

export default function BottomButtons() {
  const userData = useUserData();

  return (
    <>
      <div className={styles.Container}>
        <div className={styles.BottomButtons}>
          <Link href={userData.isLoggedIn ? "/dashboard/orders/new" : "/login"}>
            <div className={styles.NavLink}>
              <OrdersIcon />
              <div>سفارش پرینت</div>
            </div>
          </Link>
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
