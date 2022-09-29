import styles from "./style.module.scss";
import { useContext } from "react";
import Wallet from "@chap-room/main/components/Dashboard/Wallet";
import Avatar from "@chap-room/shared/components/Dashboard/Avatar";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import DashboardNavLinks from "@chap-room/main/components/Dashboard/NavLinks";

export default function DashboardSidebar() {
  const data = useContext(DashboardDataContext);

  return (
    <div className={styles.Sidebar}>
      <Wallet />
      <DashboardNavLinks />
      <div className={styles.User}>
        <Avatar user={data.state.currentUser} />
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
