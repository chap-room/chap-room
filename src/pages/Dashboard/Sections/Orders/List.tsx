import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as AddIcon } from "../../../../assets/icons/add.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import MobileContentHeader from "../../../../components/Dashboard/MobileContentHeader";
import IconButton from "../../../../components/IconButton";
import Button from "../../../../components/Button";
import OrderTabel from "../../../../components/Dashboard/OrderTabel";
import WarningConfirmDialog from "../../../../components/Dashboard/WarningConfirmDialog";

export default function DashboardOrderList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);

  return (
    <>
      <Helmet title="داشبورد - سفارش ها" />
      <ContentHeader
        title="همه سفارش ها"
        end={
          <Button onClick={() => navigate("/dashboard/orders/new")}>
            سفارش جدید
          </Button>
        }
      />
      <MobileContentHeader
        backTo="/dashboard"
        title="همه سفارش ها"
        end={
          <IconButton
            varient="filled"
            onClick={() => navigate("/dashboard/orders/new")}
          >
            <AddIcon />
          </IconButton>
        }
      />
      <OrderTabel
        orders={data.state.orders}
        onSeeOrderDetails={(orderId) =>
          navigate(`/dashboard/orders/details/${orderId}`)
        }
        onCancelOrder={setPendingOrderCancelRequest}
      />
      <WarningConfirmDialog
        open={pendingOrderCancelRequest !== null}
        onClose={() => {
          setPendingOrderCancelRequest(null);
        }}
        onConfirm={() => {
          data.dispatch({
            type: "ORDERS:CANCEL",
            payload: pendingOrderCancelRequest!,
          });
          setPendingOrderCancelRequest(null);
        }}
        message="از لغو کردن این سفارش مطمئن هستید؟"
        confirmButtonText="لغو کردن"
      />
    </>
  );
}
