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
import Button from "@/shared/components/Button";
import DiscountCodeForm from "@/admin/components/DiscountCodeForm";

export default function DashboardEditUser() {
  const data = useContext(DataContext);

  const router = useRouter();
  const { discountCodeId } = router.query;
  const discountCode = data.state.discountCodes.filter(
    (item) => item.id === discountCodeId
  )[0];

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ویرایش کد تخفیف</title>
      </Head>
      <SectionHeader
        title="کدهای تخفیف"
        description="کدهای تخفیف را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن کد تخفیف"
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
          title="ویرایش کردن کد تخفیف"
        />
        <DiscountCodeForm
          defaultValues={discountCode}
          onSave={(discountCodeData) => {
            data.dispatch({
              type: "DISCOUNT_CODES:UPDATE",
              payload: {
                id: discountCode.id,
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
