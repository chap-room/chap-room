import { ReactElement, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Order } from "@/shared/types";
import { cancelOrder, getOrders } from "@/main/api";
import { useDashboardData } from "@/main/context/dashboardData";
import { useLastPage } from "@/shared/context/lastPage";
import OrdersIcon from "@/shared/assets/icons/orders.svg";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import OrderTable from "@/main/components/Dashboard/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardOrderList() {
  const intl = useIntl();
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    orders: Order[];
  }>({
    totalCount: 0,
    pageSize: 0,
    orders: [],
  });

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

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - سفارش های من</title>
      </Head>
      <SectionHeader
        title="سفارش های من"
        description="ــ تاریخچه سفارشات خود را از این قسمت ملاحظه کنید"
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          subTitle={
            data.totalCount
              ? `(${intl.formatNumber(data.totalCount)})`
              : undefined
          }
          end={
            <Link href="/dashboard/orders/new">
              <Button varient="content-title-none">
                سفارش جدید
                <FilledIconContainer style={{ marginRight: 10 }}>
                  <OrdersIcon />
                </FilledIconContainer>
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={useLastPage("/dashboard")}
          title="سفارش های من"
          end={
            <Link href="/dashboard/orders/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <DataLoader
          load={() => getOrders(page)}
          deps={[page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <OrderTable
            orders={data.orders}
            onSeeOrderDetails={(orderId) =>
              router.push(`/dashboard/orders/${orderId}/details`)
            }
            onCancelOrder={setPendingOrderCancelRequest}
          />
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          {!data.orders.length && <EmptyNote>هیچ سفارشی وجود ندارد</EmptyNote>}
          <WarningConfirmDialog
            open={pendingOrderCancelRequest !== null}
            onClose={() => {
              setPendingOrderCancelRequest(null);
            }}
            onConfirm={() =>
              cancelOrder(pendingOrderCancelRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingOrderCancelRequest(null);
                  if (reloadRef.current) reloadRef.current();
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
            message="از لغو کردن این سفارش مطمئن هستید؟"
            confirmButtonText="لغو کردن"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardOrderList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
