import styles from "./style.module.scss";
import { useContext } from "react";
import { Link, } from "react-router-dom";
import { DataContext } from "../../../dataContext";
import userAvatarSrc from "../../../assets/img/avatar.png";
import Wallet from "../Wallet";
import { ReactComponent as CloseIcon } from "../../../assets/svg/close.svg";
import { ReactComponent as DashboardIcon } from "../../../assets/svg/dashboard.svg";
import { ReactComponent as OrdersIcon } from "../../../assets/svg/orders.svg";
import { ReactComponent as AddressesIcon } from "../../../assets/svg/addresses.svg";
import { ReactComponent as TransactionsIcon } from "../../../assets/svg/transactions.svg";
import { ReactComponent as MarketingIcon } from "../../../assets/svg/marketing.svg";
import { ReactComponent as ProfileIcon } from "../../../assets/svg/profile.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/svg/logout.svg";

interface MobileSidebarProps {
  onClose: () => void;
}

export default function MobileSidebar({onClose}: MobileSidebarProps) {
  const data = useContext(DataContext);

  return (
    <div className={styles.Sidebar}>
      <div className={styles.Top}>
        <div className={styles.Avatar}>
          <img src={userAvatarSrc} alt="User Avatar" />
        </div>
        <div className={styles.Meta}>
          <div className={styles.PhoneNumber}>
            {data.currentUser.phoneNumber}
          </div>
          <div className={styles.Name}>
            {data.currentUser.name}
          </div>
        </div>
        <div className={styles.Close} onClick={() => onClose()}>
          <CloseIcon />
        </div>
      </div>
      <div className={styles.Welcome}>!خوش‌آمدی</div>
      <Wallet />
      <Link to="/dashboard" className={styles.Link}>
        <DashboardIcon />
        داشبورد
      </Link>
      <Link to="/dashboard/orders" className={styles.Link}>
        <OrdersIcon />
        سفارش ها
      </Link>
      <Link to="/dashboard/addresses" className={styles.Link}>
        <AddressesIcon />
        آدرس ها
      </Link>
      <Link to="/dashboard/transactions" className={styles.Link}>
        <TransactionsIcon />
        تراکنش ها
      </Link>
      <Link to="/dashboard/marketing" className={styles.Link}>
        <MarketingIcon />
        بازاریابی
      </Link>
      <div className={styles.Spacer} />
      <div className={styles.Bottom}>
        <Link to="/dashboard/profile" className={styles.Link}>
          <ProfileIcon />
          پروفایل
        </Link>
        <div className={styles.Link}>
          <LogoutIcon />
          خروج
        </div>
      </div>
    </div>
  );
}
