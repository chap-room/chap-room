import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import OrderDetails from "../../../../components/Dashboard/OrderDetails";

export default function DashboardOrderDetails() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = data.state.orders.filter(
    (item) => item.id === orderId
  )[0];

  return (
    <>
      <Helmet title="داشبورد - جزئیات سفارش" />
      <ContentHeader
        title={`شماره سفارش: ${orderId}`}
        end={
          <Button onClick={() => navigate("/dashboard/orders")}>
            انصراف و بازگشت <ArrowBackIcon />
          </Button>
        }
      />
      <OrderDetails order={order} />
    </>
  );
}
