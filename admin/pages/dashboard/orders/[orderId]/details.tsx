import { ReactElement, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Order } from "@/shared/types";
import {
  cancelOrder,
  confirmOrder,
  getOrder,
  markOrderSent,
} from "@/admin/api";
import { useDashboardData } from "@/admin/context/dashboardData";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import OrderDetails from "@/shared/components/Dashboard/OrderDetails";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function DashboardOrderDetails() {
  const dashboardData = useDashboardData();
  const router = useRouter();
  const orderId = parseInt(router.query.orderId as string);

  const [data, setData] = useState<Order>();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showMarkSentDialog, setShowMarkSentDialog] = useState(false);

  const reloadRef = useRef<(() => void) | null>(null);

  const title = `سفارش ${orderId}`;

  return (
    <>
      <Head>
        <title>داشبورد - جزئیات سفارش</title>
      </Head>
      <AdminSectionHeader
        title="سفارش ها"
        description="ــ سفارشات را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title={title}
          subTitle={
            data ? `(${data.user.name} / ${data.user.phoneNumber})` : undefined
          }
          end={
            <Link
              href={
                typeof router.query.from === "string"
                  ? router.query.from
                  : "/dashboard/orders"
              }
            >
              <Button varient="none" style={{ padding: 0 }}>
                بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={
            typeof router.query.from === "string"
              ? router.query.from
              : "/dashboard/orders"
          }
          title={title}
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getOrder(orderId);
          }}
          deps={[router.isReady]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <OrderDetails order={data!} />
          {["pending", "preparing"].includes(data ? data.status : "") && (
            <BottomActions>
              {data!.status === "pending" ? (
                <>
                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    style={{
                      height: 30,
                      padding: 0,
                      color: "#f20f4b",
                      fontSize: 12,
                    }}
                  >
                    لغو سفارش
                  </Button>
                  <Button
                    varient="filled"
                    onClick={() => setShowConfirmDialog(true)}
                    style={{ height: 30, minWidth: 90, fontSize: 12 }}
                  >
                    تأیید
                  </Button>
                </>
              ) : (
                data!.status === "preparing" && (
                  <Button
                    varient="filled"
                    onClick={() => setShowMarkSentDialog(true)}
                    style={{ height: 30, minWidth: 90, fontSize: 12 }}
                  >
                    ارسال
                  </Button>
                )
              )}
            </BottomActions>
          )}
          {showCancelDialog && (
            <OrderCancelDialog
              onClose={() => setShowCancelDialog(false)}
              onCancelOrder={(reason) =>
                cancelOrder(orderId, reason)
                  .then((message) => {
                    toast.success(message);
                    setShowCancelDialog(false);
                    if (reloadRef.current) reloadRef.current();
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
            />
          )}
          <WarningConfirmDialog
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={() =>
              confirmOrder(orderId)
                .then((message) => {
                  toast.success(message);
                  setShowConfirmDialog(false);
                  if (reloadRef.current) reloadRef.current();
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
            message="از تأیید کردن این سفارش مطمئن هستید؟"
            confirmButtonText="تأیید"
          />
          {showMarkSentDialog && (
            <OrderSentDialog
              onClose={() => setShowMarkSentDialog(false)}
              onMarkOrderSent={(markOrderSentData) =>
                markOrderSent(orderId, markOrderSentData)
                  .then((message) => {
                    toast.success(message);
                    setShowMarkSentDialog(false);
                    if (reloadRef.current) reloadRef.current();
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
              orderId={orderId}
            />
          )}
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardOrderDetails.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
