import { Outlet } from "react-router-dom";
import SectionHeader from "@chap-room/shared/components/Dashboard/SectionHeader";

export default function DashboardOrders() {
  return (
    <>
      <SectionHeader
        title="سفارش ها"
        description="تاریخچه سفارشات خود را از این بخش مشاهده کنید"
      />
      <Outlet />
    </>
  );
}
