import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import OrderTable from "@/admin/components/OrderTable";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function DashboardUserOrderList() {
  const data = useContext(DataContext);
  const router = useRouter();
  const { userId } = router.query;
  const user = data.state.users.filter((item) => item.id === userId)[0];
  if (!user) return <></>; // TODO 404

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);
  const [pendingOrderConfirmRequest, setPendingOrderConfirmRequest] = useState<
    string | null
  >(null);
  const [pendingMarkOrderSentRequest, setPendingMarkOrderSentRequest] =
    useState<string | null>(null);

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - سفارش ها</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          end={
            <Link href="/dashboard/users">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard/users" title="همه سفارش ها" />
        <OrderTable
          orders={user.orders}
          onSeeOrderDetails={(orderId) =>
            router.push(`/dashboard/users/${userId}/orders/${orderId}/details`)
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
        />{" "}
        <OrderTable
          orders={user.orders}
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
          onClose={() => {
            setPendingMarkOrderSentRequest(null);
          }}
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
