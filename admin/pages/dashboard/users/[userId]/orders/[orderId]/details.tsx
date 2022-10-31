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

export default function DashboardUserOrderDetails() {
  const data = useContext(DataContext);
  const router = useRouter();
  const { userId, orderId } = router.query;
  const user = data.state.users.filter((item) => item.id === userId)[0];
  if (!user) return <></>; // TODO 404
  const order = user.orders.filter((item) => item.id === orderId)[0];
  if (!order) return <></>; // TODO 404

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - جزئیات سفارش</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="جزئیات سفارش"
          end={
            <Link href={`/dashboard/users/${userId}/orders`}>
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={`/dashboard/users/${userId}/orders`}
          title="جزئیات سفارش"
        />
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
