import styles from "./style.module.scss";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Wallet from "../Wallet";
import Avatar from "../Avatar";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/dashboard.svg";
import { ReactComponent as OrdersIcon } from "../../../assets/icons/orders.svg";
import { ReactComponent as AddressesIcon } from "../../../assets/icons/addresses.svg";
import { ReactComponent as TransactionsIcon } from "../../../assets/icons/transactions.svg";
import { ReactComponent as MarketingIcon } from "../../../assets/icons/marketing.svg";
import { ReactComponent as ProfileIcon } from "../../../assets/icons/profile.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";
import { DashboardDataContext } from "../../../context/DashboardData";

export default function Sidebar() {
  const data = useContext(DashboardDataContext);

  return (
    <div className={styles.Sidebar}>
      <Wallet />
      <NavLink to="/dashboard" end className={styles.NavLink}>
        <DashboardIcon />
        داشبورد
      </NavLink>
      <NavLink to="/dashboard/orders" className={styles.NavLink}>
        <OrdersIcon />
        سفارش ها
      </NavLink>
      <NavLink to="/dashboard/addresses" className={styles.NavLink}>
        <AddressesIcon />
        آدرس ها
      </NavLink>
      <NavLink to="/dashboard/transactions" className={styles.NavLink}>
        <TransactionsIcon />
        تراکنش ها
      </NavLink>
      <NavLink to="/dashboard/marketing" className={styles.NavLink}>
        <MarketingIcon />
        بازاریابی
      </NavLink>
      <div className={styles.Spacer} />
      <div className={styles.Bottom}>
        <NavLink to="/dashboard/profile" className={styles.NavLink}>
          <ProfileIcon />
          پروفایل
        </NavLink>
        <Link to="/" className={styles.NavLink} onClick={() => {}}>
          <LogoutIcon />
          خروج
        </Link>
        <div className={styles.User}>
        <Avatar />
          <div className={styles.Meta}>
            <div>{data.state.currentUser.name}</div>
            <div className={styles.PhoneNumber}>
              {data.state.currentUser.phoneNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
