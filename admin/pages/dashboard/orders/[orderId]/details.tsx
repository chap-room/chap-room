import { useContext } from "react";
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
import OrderDetails from "@/shared/components/Dashboard/OrderDetails";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

export default function DashboardOrderDetails() {
  const data = useContext(DataContext);

  const router = useRouter();
  const { orderId } = router.query;
  const order = data.state.orders.filter((item) => item.id === orderId)[0];

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - جزئیات سفارش</title>
      </Head>
      <SectionHeader
        title="سفارش ها"
        description="سفارشات را از این بخش مدیریت کنید"
        hideBackToSiteButton
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
        <OrderDetails order={order} />
        <BottomActions>
          <Button varient="filled" style={{ minWidth: 100 }}>
            دریافت فاکتور
          </Button>
        </BottomActions>
      </SectionContent>
    </DashboardLayout>
  );
}
