import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { FinancialRecord } from "@/shared/types";
import { getFinancialRecord, updateFinancialRecord } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import FinancialRecordForm from "@/admin/components/FinancialRecordForm";

export default function DashboardFinancialRecordEdit() {
  const router = useRouter();
  const financialRecordId = parseInt(router.query.financialRecordId as string);

  const [data, setData] = useState<FinancialRecord>();

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش سند</title>
      </Head>
      <AdminSectionHeader
        title="سوابق مالی"
        description="ــ سوابق مالی را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن سند"
          end={
            <Link
              href={
                typeof router.query.from === "string"
                  ? router.query.from
                  : "/dashboard/financial-records"
              }
            >
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={
            typeof router.query.from === "string"
              ? router.query.from
              : "/dashboard/financial-records"
          }
          title="ویرایش کردن سند"
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getFinancialRecord(financialRecordId);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <FinancialRecordForm
            defaultValues={data}
            onSave={(financialRecordData) => {
              return updateFinancialRecord(financialRecordId, {
                ...financialRecordData,
                userId: financialRecordData.user.id,
              })
                .then((message) => {
                  toast.success(message);
                  router.push(
                    typeof router.query.from === "string"
                      ? router.query.from
                      : "/dashboard/financial-records"
                  );
                })
                .catch(toast.error);
            }}
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardFinancialRecordEdit.getLayout = function getLayout(
  page: ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
