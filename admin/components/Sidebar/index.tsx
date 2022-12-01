import styles from "./style.module.scss";
import { useDashboardData } from "@/admin/context/dashboardData";
import { DataLoaderView } from "@/shared/components/DataLoader";
import DashboardNavLinks from "@/admin/components/NavLinks";
import Avatar from "@/shared/components/Dashboard/Avatar";

export default function DashboardSidebar() {
  const dashboardData = useDashboardData();

  return (
    <div className={styles.Sidebar}>
      <DataLoaderView
        state={
          dashboardData.data !== null
            ? {
                isLoading: false,
                isError: false,
                reload: dashboardData.dataLoaderState.reload,
              }
            : dashboardData.dataLoaderState
        }
      >
        {dashboardData.data !== null && (
          <>
            <div className={styles.User}>
              <Avatar
                user={{
                  name: dashboardData.data.admin.name,
                  avatar: dashboardData.data.admin.avatar,
                }}
              />
              <div className={styles.Meta}>
                <div>{dashboardData.data.admin.name}</div>
                <div className={styles.UserRole}>
                  {
                    {
                      superAdmin: "سوپر ادمین",
                      admin: "ادمین",
                      agent: "نمایندگی",
                    }[dashboardData.data.admin.role.name]
                  }
                </div>
              </div>
            </div>
            <DashboardNavLinks sidebarData={dashboardData.data.sidebarData} />
          </>
        )}
      </DataLoaderView>
    </div>
  );
}
