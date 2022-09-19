import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import OrderTabel from "../../../../components/Dashboard/OrderTabel";

export default function DashboardOrderList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  return (
    <>
      <Helmet title="داشبورد - سفارش ها" />
      <ContentHeader
        title="همه سفارشات من"
        end={
          <Button onClick={() => navigate("/dashboard/orders/new")}>
            سفارش جدید
          </Button>
        }
      />
      <OrderTabel
        orders={Object.values(data.state.orders)}
        onSeeDetails={function (orderId: string): void {
          // TODO
        }}
      />
    </>
  );
}
