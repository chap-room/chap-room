import { Outlet } from "react-router-dom";
import StickyBox from "react-sticky-box";
import styles from "./style.module.scss";
import Sidebar from "../../components/Dashboard/Sidebar";

export default function Dashboard() {
  return (
    <div className={styles.Container}>
      <div className={styles.SidebarContainer}>
        <StickyBox>
          <Sidebar />
        </StickyBox>
      </div>
      <div className={styles.ContentContainer}>
        <Outlet />
      </div>
    </div>
  );
}
