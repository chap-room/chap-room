import { Outlet } from "react-router-dom";
import StickyBox from "react-sticky-box";
import styles from "./style.module.scss";
import Sidebar from "../../components/Dashboard/Sidebar";
import { Suspense } from "react";
import DashboardSuspense from "./Suspense";

export default function Dashboard() {
  return (
    <div className={styles.Container}>
      <div className={styles.SidebarContainer}>
        <StickyBox offsetTop={50} offsetBottom={50}>
          <Sidebar />
        </StickyBox>
      </div>
      <div className={styles.ContentContainer}>
        <Suspense fallback={<DashboardSuspense />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
