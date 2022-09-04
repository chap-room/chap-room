import { Outlet } from "react-router-dom";
import Section from "../../../../components/Dashboard/Section";

export default function DashboardAddresses() {
  return (
    <Section
      title="آدرس ها"
      description="آدرس های خود را از این بخش مدیریت کنید"
    >
      <Outlet />
    </Section>
  );
}
