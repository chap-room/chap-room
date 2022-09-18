import styles from "./style.module.scss";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Wallet from "../Wallet";
import Avatar from "../Avatar";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/dashboard.svg";
import { ReactComponent as OrdersIcon } from "../../../assets/icons/orders.svg";
import { ReactComponent as AddressesIcon } from "../../../assets/icons/addresses.svg";
import { ReactComponent as TransactionsIcon } from "../../../assets/icons/transactions.svg";
import { ReactComponent as MarketingIcon } from "../../../assets/icons/marketing.svg";
import { ReactComponent as ProfileIcon } from "../../../assets/icons/profile.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/logout.svg";
import { DashboardDataContext } from "../../../context/DashboardData";

interface MobileSidebarProps {
  onClose: () => void;
}

export default function MobileSidebar({onClose}: MobileSidebarProps) {
  const data = useContext(DashboardDataContext);

  return (
    <div className={styles.Sidebar}>
      <div className={styles.Top}>
        <Avatar />
        <div className={styles.Meta}>
          <div className={styles.PhoneNumber}>
            {data.state.currentUser.phoneNumber}
          </div>
          <div className={styles.Name}>
            {data.state.currentUser.name}
          </div>
        </div>
        <div className={styles.Close} onClick={() => onClose()}>
          <CloseIcon />
        </div>
      </div>
      <div className={styles.Welcome}>!خوش‌آمدی</div>
      <Wallet />
      <NavLink to="/dashboard" className={styles.NavLink}>
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
      </div>
    </div>
  );
}
