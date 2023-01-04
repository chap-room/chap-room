import { ReactElement, useRef, useState } from "react";
import { useRouter } from "next/router";
import ReactToPrint from "react-to-print";
import Head from "next/head";
import Link from "next/link";
import { Order } from "@/shared/types";
import { getOrder } from "@/main/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import OrderDetails from "@/shared/components/Dashboard/OrderDetails";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

export default function DashboardOrderDetails() {
  const router = useRouter();
  const orderId = parseInt(router.query.orderId as string);

  const [data, setData] = useState<Order>();

  const title = `شماره سفارش: ${orderId}`;
  const orderDetailsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>داشبورد - جزئیات سفارش</title>
      </Head>
      <SectionHeader
        title="سفارش های من"
        description="ــ تاریخچه سفارشات خود را از این قسمت ملاحظه کنید"
      />
      <SectionContent>
        <ContentHeader
          title={title}
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
          title="جزییات"
          subTitle={title}
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getOrder(orderId);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <div ref={orderDetailsContainerRef}>
            <OrderDetails order={data!} />
          </div>
          <BottomActions>
            <ReactToPrint
              content={() => orderDetailsContainerRef.current}
              documentTitle={title}
              removeAfterPrint
              trigger={() => (
                <Button varient="filled" style={{ minWidth: 100 }}>
                  دریافت فاکتور
                </Button>
              )}
              pageStyle="body {direction: rtl; margin: 0; padding: 50px; box-sizing: border-box;}"
            />
          </BottomActions>
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardOrderDetails.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
