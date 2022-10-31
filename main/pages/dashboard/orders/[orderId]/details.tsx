import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  PostageMethod,
} from "@/shared/types";
import { getOrder } from "@/main/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/Dashboard/DataLoader";
import OrderDetails from "@/shared/components/Dashboard/OrderDetails";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

export default function DashboardOrderDetails() {
  const router = useRouter();
  const orderId = router.query.orderId as string;

  const [data, setData] = useState<Order>({
    id: orderId,
    date: new Date(),
    status: OrderStatus.pending,
    recipientName: "",
    recipientPhoneNumber: "",
    recipientDeliveryProvince: "",
    recipientDeliveryCity: "",
    recipientPostalCode: "",
    recipientDeliveryAddress: "",
    amount: 0,
    postageFee: 0,
    postageDate: null,
    postageMethod: PostageMethod.expressMail,
    discountAmount: null,
    discountCode: "",
    paymentMethod: {
      [PaymentMethod.zarinPalGate]: 0,
      [PaymentMethod.wallet]: 0,
    },
    cancelReason: null,
    lastUpdateDate: new Date(),
    trackingNumber: null,
    printFolders: [],
  });

  return (
    <>
      <Head>
        <title>داشبورد - جزئیات سفارش</title>
      </Head>
      <SectionHeader
        title="سفارش ها"
        description="تاریخچه سفارشات خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader
          title="جزئیات سفارش"
          end={
            <Link href="/dashboard/orders">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard/orders" title="جزئیات سفارش" />
        <DataLoader
          load={() => {
            if (router.isReady) return getOrder(orderId);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <OrderDetails order={data} />
          <BottomActions>
            <Button varient="filled" style={{ minWidth: 100 }}>
              دریافت فاکتور
            </Button>
          </BottomActions>
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardOrderDetails.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
