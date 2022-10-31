import styles from "./style.module.scss";
import { useContext } from "react";
import { DataContext } from "@/admin/context/Data";
import DashboardNavLinks from "@/admin/components/NavLinks";
import Avatar from "@/shared/components/Dashboard/Avatar";

export default function DashboardSidebar() {
  const data = useContext(DataContext);

  return (
    <div className={styles.Sidebar}>
      <div className={styles.User}>
        <Avatar user={data.state.currentUser} />
        <div className={styles.Meta}>
          <div>{data.state.currentUser.name}</div>
          <div className={styles.UserRole}>
            {data.state.currentUser.role}
          </div>
        </div>
      </div>
      <DashboardNavLinks />
    </div>
  );
}
