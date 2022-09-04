import styles from "./style.module.scss";
import { useContext } from "react";
import { NavLink, } from "react-router-dom";
import { DataContext } from "../../../dataContext";
import userAvatarSrc from "../../../assets/img/avatar.png";
import Wallet from "../Wallet";
import { ReactComponent as DashboardIcon } from "../../../assets/svg/dashboard.svg";
import { ReactComponent as OrdersIcon } from "../../../assets/svg/orders.svg";
import { ReactComponent as AddressesIcon } from "../../../assets/svg/addresses.svg";
import { ReactComponent as TransactionsIcon } from "../../../assets/svg/transactions.svg";
import { ReactComponent as MarketingIcon } from "../../../assets/svg/marketing.svg";
import { ReactComponent as ProfileIcon } from "../../../assets/svg/profile.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/svg/logout.svg";

export default function Sidebar() {
  const data = useContext(DataContext);

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
        <div className={styles.NavLink}>
          <LogoutIcon />
          خروج
        </div>
        <div className={styles.User}>
          <div className={styles.Avatar}>
            <img src={userAvatarSrc} alt="User Avatar" />
          </div>
          <div className={styles.Meta}>
            <div>{data.currentUser.name}</div>
            <div className={styles.PhoneNumber}>
              {data.currentUser.phoneNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
