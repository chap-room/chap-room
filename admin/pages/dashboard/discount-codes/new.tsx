import { useContext } from "react";
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
import DiscountCodeForm from "@/admin/components/DiscountCodeForm";

export default function DashboardNewDiscountCode() {
  const data = useContext(DataContext);
  const router = useRouter();

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ایجاد کد تخفیف</title>
      </Head>
      <SectionHeader
        title="کدهای تخفیف"
        description="کدهای تخفیف را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ایجاد کد تخفیف جدید"
          end={
            <Link href="/dashboard/discount-codes">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/discount-codes"
          title="ایجاد کد تخفیف جدید"
        />
        <DiscountCodeForm
          onSave={(discountCodeData) => {
            data.dispatch({
              type: "DISCOUNT_CODES:PUSH",
              payload: {
                id: uuidv4(),
                ...discountCodeData,
              },
            });
            router.push("/dashboard/discount-codes");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
