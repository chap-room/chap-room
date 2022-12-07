import styles from "./style.module.scss";
import { useDashboardData } from "@/main/context/dashboardData";
import { DataLoaderView } from "@/shared/components/DataLoader";
import DashboardNavLinks from "@/main/components/Dashboard/NavLinks";
import Wallet from "@/main/components/Dashboard/Wallet";
import Avatar from "@/shared/components/Dashboard/Avatar";

export default function DashboardSidebar() {
  const dashboardData = useDashboardData();

  return (
    <div className={styles.Sidebar}>
      <DataLoaderView state={dashboardData.loaderState}>
        <Wallet />
        <DashboardNavLinks />
        {dashboardData.data !== null && (
          <div className={styles.User}>
            <Avatar user={dashboardData.data} />
            <div className={styles.Meta}>
              <div>{dashboardData.data.name}</div>
              <div className={styles.PhoneNumber}>
                {dashboardData.data.phoneNumber}
              </div>
            </div>
          </div>
        )}
      </DataLoaderView>
    </div>
  );
}
