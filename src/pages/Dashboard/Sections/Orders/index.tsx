import { Outlet } from "react-router-dom";
import Section from "../../../../components/Dashboard/Section";

export default function DashboardOrders() {
  
  return (
    <Section
      title="سفارش ها"
      description="تاریخچه سفارشات خود را از این بخش مشاهده کنید"
    >
      <Outlet />
    </Section>
  );
}
