
// import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// import { DashboardDataContext } from "../../../../../context/DashboardData";
import OrderForm from "../../../../components/Dashboard/OrderForm";


export default function DashboardNewOrder() {
  // const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  return (
    <>
      <Helmet title="داشبورد - سفارش جدید" />
      <OrderForm onCancel={() => navigate('/dashboard/orders')} onSave={() => {}} />
    </>
  );
}
