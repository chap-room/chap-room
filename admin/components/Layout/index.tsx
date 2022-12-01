import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import { DashboardDataProvider } from "@/admin/context/dashboardData";
import DashboardSidebar from "@/admin/components/Sidebar";

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
