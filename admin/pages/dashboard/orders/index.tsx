import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import { Order } from "@/shared/types";
import {
  cancelOrder,
  confirmOrder,
  getOrders,
  markOrderSent,
} from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import { useDashboardData } from "@/admin/context/dashboardData";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import OrderTable from "@/admin/components/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function DashboardOrderList() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    orders: Order[];
  }>({ totalCount: 0, pageSize: 0, orders: [] });

  const [itemsStatus, setItemsStatus] = useState<
    "canceled" | "pending" | "preparing" | "sent" | null
  >("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (
          router.query.tab === "all" ||
          router.query.tab === "canceled" ||
          router.query.tab === "pending" ||
          router.query.tab === "preparing" ||
          router.query.tab === "sent"
        ) {
          setItemsStatus(router.query.tab === "all" ? null : router.query.tab);
        }
        if (router.query.search) {
          setSearch(router.query.search as string);
        }
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

        if (itemsStatus !== "pending")
          query.tab = itemsStatus === null ? "all" : itemsStatus;
        if (search) query.search = search;
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
  }, [router.isReady, itemsStatus, search, page]);

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    number | null
  >(null);
  const [pendingOrderConfirmRequest, setPendingOrderConfirmRequest] = useState<
    number | null
  >(null);
  const [pendingMarkOrderSentRequest, setPendingMarkOrderSentRequest] =
    useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - سفارش ها</title>
      </Head>
      <AdminSectionHeader
        title="سفارش ها"
        description="ــ سفارشات را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <SwitchButtons
              options={[
                {
                  id: "canceled",
                  label: "لغو شده",
                },
                {
                  id: "pending",
                  label: "در انتظار بررسی",
                },
                {
                  id: "preparing",
                  label: "در حال آماده سازی",
                },
                {
                  id: "sent",
                  label: "ارسال شده",
                },
              ]}
              value={itemsStatus}
              onChange={(newValue) => {
                setItemsStatus(newValue);
                setPage(1);
              }}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه سفارش ها" />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "جستجو کد سفارش" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() => getOrders(search, page, itemsStatus)}
          deps={[search, page, itemsStatus]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <OrderTable
            orders={data.orders}
            onSeeOrderDetails={(orderId) =>
              router.push(
                `/dashboard/orders/${orderId}/details?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
            onCancelOrder={setPendingOrderCancelRequest}
            onConfirmOrder={setPendingOrderConfirmRequest}
            onMarkOrderSent={setPendingMarkOrderSentRequest}
            itemsStatus={itemsStatus}
          />
          {!data.orders.length && <EmptyNote>هیچ سفارشی وجود ندارد</EmptyNote>}
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
                    if (reloadRef.current) reloadRef.current();
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
                  if (reloadRef.current) reloadRef.current();
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
            message="از تأیید کردن این سفارش مطمئن هستید؟"
            confirmButtonText="تأیید"
          />
          {pendingMarkOrderSentRequest !== null && (
            <OrderSentDialog
              onClose={() => setPendingMarkOrderSentRequest(null)}
              onMarkOrderSent={(trackingCode) =>
                markOrderSent(pendingMarkOrderSentRequest!, trackingCode)
                  .then((message) => {
                    toast.success(message);
                    setPendingMarkOrderSentRequest(null);
                    if (reloadRef.current) reloadRef.current();
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

DashboardOrderList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
