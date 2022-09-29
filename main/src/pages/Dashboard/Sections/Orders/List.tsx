import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import { ReactComponent as AddIcon } from "@chap-room/shared/assets/icons/add.svg";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@chap-room/shared/components/IconButton";
import Button from "@chap-room/shared/components/Button";
import OrderTable from "@chap-room/shared/components/Dashboard/OrderTable";
import WarningConfirmDialog from "@chap-room/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardOrderList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);

  return (
    <SectionContent>
      <Helmet title="داشبورد - سفارش ها" />
      <ContentHeader
        title="همه سفارش ها"
        end={
          <Button
            style={{ padding: 0 }}
            onClick={() => navigate("/dashboard/orders/new")}
          >
            سفارش جدید <AddIcon />
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
      <OrderTable
        orders={data.state.orders}
        onSeeOrderDetails={(orderId) =>
          navigate(`/dashboard/orders/${orderId}/details`)
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
    </SectionContent>
  );
}
