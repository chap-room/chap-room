import { ReactElement } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { newDiscount } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DiscountForm from "@/admin/components/DiscountForm";

export default function DashboardNewDiscount() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>داشبورد - ایجاد کد تخفیف</title>
      </Head>
      <AdminSectionHeader
        title="کدهای تخفیف"
        description="ــ کدهای تخفیف را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="ایجاد کد تخفیف جدید"
          end={
            <Link href="/dashboard/discounts">
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/discounts"
          title="ایجاد کد تخفیف جدید"
        />
        <DiscountForm
          onSave={(discountData) =>
            newDiscount({
              ...discountData,
              userId: discountData.user?.id || null,
            })
              .then((message) => {
                toast.success(message);
                router.push("/dashboard/discounts");
              })
              .catch(toast.error)
          }
        />
      </SectionContent>
    </>
  );
}

DashboardNewDiscount.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
