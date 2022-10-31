import styles from "./style.module.scss";
import { PropsWithChildren, Suspense, useReducer } from "react";
import StickyBox from "react-sticky-box";
import {
  DataContext,
  dataReducer,
  initialState,
} from "@/admin/context/Data";
import DashboardSidebar from "@/admin/components/Sidebar";

export default function DashboardLayout({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      <div className={styles.Container}>
        <div className={styles.SidebarContainer}>
          <StickyBox offsetTop={50} offsetBottom={50}>
            <DashboardSidebar />
          </StickyBox>
        </div>
        <div className={styles.ContentContainer}>{children}</div>
      </div>
    </DataContext.Provider>
  );
}
