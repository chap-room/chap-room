import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Order } from "@/shared/types";
import { cancelOrder, getOrders } from "@/main/api";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import OrderTable from "@/main/components/Dashboard/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardOrderList() {
  const router = useRouter();
  const [data, setData] = useState<{
    countOfItems: number;
    orders: Order[];
  }>({
    countOfItems: 0,
    orders: [],
  });

  const [page, setPage] = useState(1);

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    number | null
  >(null);

  const [reload, setRelaod] = useState(true);

  return (
    <>
      <Head>
        <title>داشبورد - سفارش ها</title>
      </Head>
      <SectionHeader
        title="سفارش ها"
        description="تاریخچه سفارشات خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader
          title="همه سفارش ها"
          end={
            <Link href="/dashboard/orders/new">
              <Button style={{ padding: 0 }}>
                سفارش جدید <AddIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="همه سفارش ها"
          end={
            <Link href="/dashboard/orders/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <DataLoader
          load={() => {
            if (reload) {
              setRelaod(false);
              return getOrders(page);
            }
          }}
          deps={[reload]}
          setData={setData}
        >
          <OrderTable
            orders={data.orders}
            onSeeOrderDetails={(orderId) =>
              router.push(`/dashboard/orders/${orderId}/details`)
            }
            onCancelOrder={setPendingOrderCancelRequest}
          />
          {!data.orders.length && <EmptyNote>شما هیچ سفارشی ندارید</EmptyNote>}
          <WarningConfirmDialog
            open={pendingOrderCancelRequest !== null}
            onClose={() => {
              setPendingOrderCancelRequest(null);
            }}
            onConfirm={() =>
              cancelOrder(pendingOrderCancelRequest!)
                .then((message) => {
                  toast.success(message);
                  setRelaod(true);
                  setPendingOrderCancelRequest(null);
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
