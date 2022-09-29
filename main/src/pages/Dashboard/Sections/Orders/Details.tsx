import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import { ReactComponent as ArrowBackIcon } from "@chap-room/shared/assets/icons/arrowBack.svg";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import OrderDetails from "@chap-room/shared/components/Dashboard/OrderDetails";
import Button from "@chap-room/shared/components/Button";
import BottomActions from "@chap-room/shared/components/Dashboard/BottomActions";

export default function DashboardOrderDetails() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const { orderId } = useParams();
  const order = data.state.orders.filter((item) => item.id === orderId)[0];

  return (
    <SectionContent>
      <Helmet title="داشبورد - جزئیات سفارش" />
      <ContentHeader
        title="جزئیات سفارش"
        end={
          <Button
            style={{ padding: 0 }}
            onClick={() => navigate("/dashboard/orders")}
          >
            انصراف و بازگشت <ArrowBackIcon />
          </Button>
        }
      />
      <MobileContentHeader backTo="/dashboard/orders" title="جزئیات سفارش" />
      <OrderDetails order={order} />
      <BottomActions>
        <Button varient="filled" style={{ minWidth: 100 }}>
          دریافت فاکتور
        </Button>
      </BottomActions>
    </SectionContent>
  );
}
