import { useContext, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { OrderStatus } from "@/shared/types";
import { DataContext } from "@/admin/context/Data";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import OrderTable from "@/admin/components/OrderTable";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function DashboardOrderList() {
  const data = useContext(DataContext);
  const router = useRouter();

  const [filterByOrderStatus, setFilterByOrderStatus] =
    useState<OrderStatus | null>(null);
  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);
  const [pendingOrderConfirmRequest, setPendingOrderConfirmRequest] = useState<
    string | null
  >(null);
  const [pendingMarkOrderSentRequest, setPendingMarkOrderSentRequest] =
    useState<string | null>(null);

  const orders = data.state.orders.filter((item) => {
    if (filterByOrderStatus !== null) {
      if (item.status !== filterByOrderStatus) {
        return false;
      }
    }
    return true;
  });

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - سفارش ها</title>
      </Head>
      <SectionHeader
        title="سفارش ها"
        description="سفارشات را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          end={
            <SwitchButtons
              options={[
                {
                  id: OrderStatus.canceled,
                  label: OrderStatus.canceled,
                },
                {
                  id: OrderStatus.pending,
                  label: OrderStatus.pending,
                },
                {
                  id: OrderStatus.preparing,
                  label: OrderStatus.preparing,
                },
                {
                  id: OrderStatus.sent,
                  label: OrderStatus.sent,
                },
              ]}
              value={filterByOrderStatus}
              onChange={setFilterByOrderStatus}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه سفارش ها" />
        <OrderTable
          orders={orders}
          onSeeOrderDetails={(orderId) =>
            router.push(`/dashboard/orders/${orderId}/details`)
          }
          onCancelOrder={setPendingOrderCancelRequest}
          onConfirmOrder={setPendingOrderConfirmRequest}
          onMarkOrderSent={setPendingMarkOrderSentRequest}
        />
        <OrderCancelDialog
          open={pendingOrderCancelRequest !== null}
          onClose={() => {
            setPendingOrderCancelRequest(null);
          }}
          onCancelOrder={(reason) => {
            data.dispatch({
              type: "ORDERS:CANCEL",
              payload: [pendingOrderCancelRequest!, reason],
            });
            setPendingOrderCancelRequest(null);
          }}
        />
        <WarningConfirmDialog
          open={pendingOrderConfirmRequest !== null}
          onClose={() => {
            setPendingOrderConfirmRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "ORDERS:CONFIRM",
              payload: pendingOrderConfirmRequest!,
            });
            setPendingOrderConfirmRequest(null);
          }}
          message="از تائیید کردن این سفارش مطمئن هستید؟"
          confirmButtonText="تائیید"
        />
        <OrderSentDialog
          open={pendingMarkOrderSentRequest !== null}
          onClose={() => setPendingMarkOrderSentRequest(null)}
          onMarkOrderSent={(trackingCode) => {
            data.dispatch({
              type: "ORDERS:SENT",
              payload: [pendingMarkOrderSentRequest!, trackingCode],
            });
            setPendingMarkOrderSentRequest(null);
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
