import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@/shared/components/IconButton";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import FinancialRecordTable from "@/admin/components/FinancialRecordTable";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardFinancialRecordList() {
  const data = useContext(DataContext);
  const router = useRouter();

  const [
    pendingFinancialRecordCodeDeleteRequest,
    setPendingFinancialRecordCodeDeleteRequest,
  ] = useState<string | null>(null);

  const financialRecords = data.state.financialRecords;

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - سوابق مالی</title>
      </Head>
      <SectionHeader
        title="سوابق مالی"
        description="سوابق مالی را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه سوابق مالی"
          end={
            <ButtonList>
              <Link href="/dashboard/financial-records/total-income">
                <Button varient="filled">کل درآمد</Button>
              </Link>
              <Link href="/dashboard/financial-records/new">
                <Button style={{ padding: 0 }}>
                  ایجاد سند <AddIcon />
                </Button>
              </Link>
            </ButtonList>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="همه سوابق مالی"
          end={
            <Link href="/dashboard/financial-records/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <FinancialRecordTable
          financialRecords={financialRecords}
          onSeeDetails={(orderId) =>
            router.push(`/dashboard/orders/${orderId}/details`)
          }
          onEditFinancialRecord={(financialRecordId) =>
            router.push(
              `/dashboard/financial-records/${financialRecordId}/edit`
            )
          }
          onDeleteFinancialRecord={setPendingFinancialRecordCodeDeleteRequest}
        />
        <WarningConfirmDialog
          open={pendingFinancialRecordCodeDeleteRequest !== null}
          onClose={() => {
            setPendingFinancialRecordCodeDeleteRequest(null);
          }}
          onConfirm={() => {
            // data.dispatch({
            //   type: "DISCOUNT_CODES:DELETE",
            //   payload: pendingFinancialRecordCodeDeleteRequest!,
            // });
            setPendingFinancialRecordCodeDeleteRequest(null);
          }}
          message="از حذف این سند مطمئن هستید؟"
          confirmButtonText="حذف"
        />
      </SectionContent>
    </DashboardLayout>
  );
}
