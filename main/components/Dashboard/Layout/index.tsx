import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import { DashboardDataProvider } from "@/main/context/dashboardData";
import DashboardSidebar from "@/main/components/Dashboard/Sidebar";

export default function DashboardLayout({ children }: PropsWithChildren<{}>) {
  return (
    <DashboardDataProvider>
      <div className={styles.Container}>
        <div className={styles.SidebarContainer}>
          <DashboardSidebar />
        </div>
        <div className={styles.ContentContainer}>{children}</div>
      </div>
    </DashboardDataProvider>
  );
}
