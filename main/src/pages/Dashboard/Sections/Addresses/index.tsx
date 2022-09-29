import { Outlet } from "react-router-dom";
import SectionHeader from "@chap-room/shared/components/Dashboard/SectionHeader";

export default function DashboardAddresses() {
  return (
    <>
      <SectionHeader
        title="آدرس ها"
        description="آدرس های خود را از این بخش مدیریت کنید"
      />
      <Outlet />
    </>
  );
}
