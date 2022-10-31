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
import FinancialRecordForm from "@/admin/components/FinancialRecordForm";

export default function DashboardFinancialRecordEdit() {
  const data = useContext(DataContext);

  const router = useRouter();
  const { financialRecordId } = router.query;
  const financialRecord = data.state.financialRecords.filter(
    (item) => item.id === financialRecordId
  )[0];

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ویرایش سند</title>
      </Head>
      <SectionHeader
        title="سوابق مالی"
        description="سوابق مالی را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن سند"
          end={
            <Link href="/dashboard/financial-records">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/financial-records"
          title="ویرایش کردن سند"
        />
        <FinancialRecordForm
          defaultValues={financialRecord}
          onSave={(discountCodeData) => {
            // data.dispatch({ // TODO
            //   type: "DISCOUNT_CODES:UPDATE",
            //   payload: {
            //     id: financialRecord.id,
            //     ...discountCodeData,
            //   },
            // });
            router.push("/dashboard/financial-records");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
