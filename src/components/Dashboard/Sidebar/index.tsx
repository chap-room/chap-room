import styles from "./style.module.scss";
import { useContext } from "react";
import Wallet from "../Wallet";
import Avatar from "../Avatar";
import { DashboardDataContext } from "../../../context/DashboardData";
import DashboardNavLinks from "../NavLinks";

export default function DashboardSidebar() {
  const data = useContext(DashboardDataContext);

  return (
    <div className={styles.Sidebar}>
      <Wallet />
      <DashboardNavLinks />
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
  );
}
