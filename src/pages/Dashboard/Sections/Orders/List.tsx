import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";

export default function DashboardOrderList() {
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
      Order List
    </>
  );
}
