import { Suspense, useReducer } from "react";
import { Outlet } from "react-router-dom";
import StickyBox from "react-sticky-box";
import styles from "./style.module.scss";
import Sidebar from "../../components/Dashboard/Sidebar";
import SuspenseLoader from "../../components/SuspenseLoader";
import {
  DashboardDataContext,
  dashboardDataReducer,
  initialState,
} from "../../context/DashboardData";

export default function Dashboard() {
  const [state, dispatch] = useReducer(dashboardDataReducer, initialState);

  return (
    <DashboardDataContext.Provider value={{ state, dispatch }}>
      <div className={styles.Container}>
        <div className={styles.SidebarContainer}>
          <StickyBox offsetTop={50} offsetBottom={50}>
            <Sidebar />
          </StickyBox>
        </div>
        <div className={styles.ContentContainer}>
          <Suspense fallback={<SuspenseLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </DashboardDataContext.Provider>
  );
}
