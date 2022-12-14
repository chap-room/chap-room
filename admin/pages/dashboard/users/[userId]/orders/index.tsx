import { ReactElement, useEffect, useState } from "react";
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

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

        if (page > 1) query.page = page.toString();

        router.push(
          {
            pathname: router.pathname,
            query,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, page]);

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
        <title>?????????????? - ?????????? ????</title>
      </Head>
      <AdminSectionHeader
        title="??????????????"
        description="???? ???????????? ?? ???????????? ?????????????? ???? ?????? ????????"
      />
      <SectionContent>
        <ContentHeader
          title="?????? ?????????? ????"
          subTitle={
            data.user
              ? `(${data.user.name} / ${data.user.phoneNumber})`
              : undefined
          }
          end={
            <Link
              href={
                typeof router.query.from === "string"
                  ? router.query.from
                  : "/dashboard/users"
              }
            >
              <Button varient="none" style={{ padding: 0 }}>
                ???????????? <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={
            typeof router.query.from === "string"
              ? router.query.from
              : "/dashboard/users"
          }
          title="?????? ?????????? ????"
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
                `/dashboard/users/${userId}/orders/${orderId}/details?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
            onCancelOrder={setPendingOrderCancelRequest}
            onConfirmOrder={setPendingOrderConfirmRequest}
            onMarkOrderSent={setPendingMarkOrderSentRequest}
            itemsStatus={null}
          />
          {!data.orders.length && (
            <EmptyNote>?????? ?????????? ?????? ???????????? ??????????</EmptyNote>
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
            message="???? ???????????? ???????? ?????? ?????????? ?????????? ????????????"
            confirmButtonText="????????????"
          />
          {pendingMarkOrderSentRequest !== null && (
            <OrderSentDialog
              onClose={() => {
                setPendingMarkOrderSentRequest(null);
              }}
              onMarkOrderSent={(markOrderSentData) =>
                markOrderSent(pendingMarkOrderSentRequest!, markOrderSentData)
                  .then((message) => {
                    toast.success(message);
                    setPendingMarkOrderSentRequest(null);
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
              orderId={pendingMarkOrderSentRequest || 0}
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
