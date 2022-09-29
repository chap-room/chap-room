
// import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import OrderForm from "@chap-room/main/components/Dashboard/OrderForm";

export default function DashboardNewOrder() {
  // const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  return (
    <SectionContent>
      <Helmet title="داشبورد - سفارش جدید" />
      <OrderForm onCancel={() => navigate('/dashboard/orders')} onSave={() => {}} />
    </SectionContent>
  );
}
