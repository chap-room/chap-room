import styles from "./style.module.scss";
import { Link, NavLink } from "react-router-dom";
import { ReactComponent as NavigateBeforeIcon } from "@chap-room/shared/assets/icons/navigateBefore.svg";
import { ReactComponent as DashboardIcon } from "@chap-room/shared/assets/icons/dashboard.svg";
import { ReactComponent as OrdersIcon } from "@chap-room/main/assets/icons/orders.svg";
import { ReactComponent as AddressesIcon } from "@chap-room/main/assets/icons/addresses.svg";
import { ReactComponent as TransactionsIcon } from "@chap-room/main/assets/icons/transactions.svg";
import { ReactComponent as MarketingIcon } from "@chap-room/main/assets/icons/marketing.svg";
import { ReactComponent as ProfileIcon } from "@chap-room/main/assets/icons/profile.svg";
import { ReactComponent as LogoutIcon } from "@chap-room/shared/assets/icons/logout.svg";

export default function DashboardNavLinks() {
  return (
    <>
      <NavLink
        to="/dashboard"
        end
        className={[styles.NavLink, styles.DashboardLink].join(" ")}
      >
        <DashboardIcon />
        <div className={styles.Text}>داشبورد</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <NavLink to="/dashboard/orders" className={styles.NavLink}>
        <OrdersIcon />
        <div className={styles.Text}>سفارش ها</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <NavLink to="/dashboard/addresses" className={styles.NavLink}>
        <AddressesIcon />
        <div className={styles.Text}>آدرس ها</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <NavLink to="/dashboard/transactions" className={styles.NavLink}>
        <TransactionsIcon />
        <div className={styles.Text}>تراکنش ها</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <NavLink to="/dashboard/marketing" className={styles.NavLink}>
        <MarketingIcon />
        <div className={styles.Text}>بازاریابی</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <div className={styles.Spacer} />
      <NavLink to="/dashboard/profile" className={styles.NavLink}>
        <ProfileIcon />
        <div className={styles.Text}>پروفایل</div>
        <div className={styles.Arrow}>
          <NavigateBeforeIcon />
        </div>
      </NavLink>
      <Link to="/" className={styles.NavLink} onClick={() => {}}>
        <LogoutIcon />
        خروج
      </Link>
    </>
  );
}
