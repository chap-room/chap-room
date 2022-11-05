import { ReactElement, useContext } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DiscountForm from "@/admin/components/DiscountForm";

export default function DashboardNewPost() {
  const data = useContext(DataContext);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>داشبورد - ایجاد نوشته</title>
      </Head>
      <SectionHeader
        title="وبلاگ"
        description="وبلاگ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ایجاد نوشته جدید"
          end={
            <Link href="/dashboard/discounts">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/discounts"
          title="ایجاد نوشته جدید"
        />
        <DiscountForm
          onSave={(discountData) => {
            data.dispatch({
              type: "DISCOUNT_CODES:PUSH",
              payload: {
                id: uuidv4(),
                ...discountData,
              },
            });
            router.push("/dashboard/discounts");
          }}
        />
      </SectionContent>
    </>
  );
}

DashboardNewPost.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
