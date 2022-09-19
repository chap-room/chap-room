import styles from "./style.module.scss";
import { Helmet } from "react-helmet";
import { ReactComponent as ArrowBackIcon } from "../../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";
import Button from "../../../../../components/Button";
import { useNavigate, useParams } from "react-router-dom";

export default function DashboardOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

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
      <div className={styles.OrderDetails}></div>
    </>
  );
}
