import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Order, User } from "@/shared/types";
import {
  cancelOrder,
  confirmOrder,
  getUserOrders,
  markOrderSent,
} from "@/admin/api";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import { useDashboardData } from "@/admin/context/dashboardData";
import DataLoader from "@/shared/components/DataLoader";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import OrderTable from "@/admin/components/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function DashboardUserOrderList() {
  const dashboardData = useDashboardData();
  const router = useRouter();
  const userId = parseInt(router.query.userId as string); // TODO 404

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    user: User | null;
    orders: Order[];
  }>({ totalCount: 0, pageSize: 0, user: null, orders: [] });

  const [page, setPage] = useState(1);

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    number | null
  >(null);
  const [pendingOrderConfirmRequest, setPendingOrderConfirmRequest] = useState<
    number | null
  >(null);
  const [pendingMarkOrderSentRequest, setPendingMarkOrderSentRequest] =
    useState<number | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - سفارش ها</title>
      </Head>
      <AdminSectionHeader
        title="کاربران"
        description="ــ افزودن و ویرایش کاربران از این قسمت"
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          subTitle={
            data.user
              ? `(${data.user.name} / ${englishToPersianNumbers(
                  data.user.phoneNumber
                )})`
              : undefined
          }
          end={
            <Link
              href={
                router.query.fromCustomerReports === "true"
                  ? "/dashboard/customer-reports"
                  : "/dashboard/users"
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
            router.query.fromCustomerReports === "true"
              ? "/dashboard/customer-reports"
              : "/dashboard/users"
          }
          title="همه سفارش ها"
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getUserOrders(userId, page);
          }}
          deps={[router.isReady, page]}
          setData={setData}
        >
          <OrderTable
            orders={data.orders}
            onSeeOrderDetails={(orderId) =>
              router.push(
                `/dashboard/users/${userId}/orders/${orderId}/details`
              )
            }
            onCancelOrder={setPendingOrderCancelRequest}
            onConfirmOrder={setPendingOrderConfirmRequest}
            onMarkOrderSent={setPendingMarkOrderSentRequest}
            itemsStatus={null}
          />
          {!data.orders.length && (
            <EmptyNote>این کاربر هیچ سفارشی ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          {pendingOrderCancelRequest !== null && (
            <OrderCancelDialog
              onClose={() => {
                setPendingOrderCancelRequest(null);
              }}
              onCancelOrder={(reason) =>
                cancelOrder(pendingOrderCancelRequest!, reason)
                  .then((message) => {
                    toast.success(message);
                    setPendingOrderCancelRequest(null);
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
            />
          )}
          <WarningConfirmDialog
            open={pendingOrderConfirmRequest !== null}
            onClose={() => {
              setPendingOrderConfirmRequest(null);
            }}
            onConfirm={() =>
              confirmOrder(pendingOrderConfirmRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingOrderConfirmRequest(null);
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
            message="از تأیید کردن این سفارش مطمئن هستید؟"
            confirmButtonText="تأیید"
          />
          {pendingMarkOrderSentRequest !== null && (
            <OrderSentDialog
              onClose={() => {
                setPendingMarkOrderSentRequest(null);
              }}
              onMarkOrderSent={(trackingCode) =>
                markOrderSent(pendingMarkOrderSentRequest!, trackingCode)
                  .then((message) => {
                    toast.success(message);
                    setPendingMarkOrderSentRequest(null);
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
            />
          )}
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardUserOrderList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
