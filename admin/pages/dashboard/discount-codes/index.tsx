import { useContext, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { DataContext } from "@/admin/context/Data";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import DiscountCodeTable from "@/admin/components/DiscountCodeTable";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import Link from "next/link";

export default function DashboardDiscountCodeList() {
  const data = useContext(DataContext);
  const router = useRouter();

  const [
    pendingDiscountCodeActivateRequest,
    setPendingDiscountCodeActivateRequest,
  ] = useState<string | null>(null);
  const [
    pendingDiscountCodeInactivateRequest,
    setPendingDiscountCodeInactivateRequest,
  ] = useState<string | null>(null);
  const [
    pendingDiscountCodeDeleteRequest,
    setPendingDiscountCodeDeleteRequest,
  ] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - کدهای تخفیف</title>
      </Head>
      <SectionHeader
        title="کدهای تخفیف"
        description="کدهای تخفیف را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه کدهای تخفیف"
          end={
            <Link href="/dashboard/discount-codes/new">
              <Button style={{ padding: 0 }}>
                ایجاد کد تخفیف <AddIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="همه کدهای تخفیف"
          end={
            <Link href="/dashboard/discount-codes/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <DiscountCodeTable
          discountCodes={data.state.discountCodes}
          onEditDiscountCode={(discountCodeId) =>
            router.push(`/dashboard/discount-codes/${discountCodeId}/edit`)
          }
          onActivateDiscountCode={setPendingDiscountCodeActivateRequest}
          onInactivateDiscountCode={setPendingDiscountCodeInactivateRequest}
          onDeleteDiscountCode={setPendingDiscountCodeDeleteRequest}
        />
        <WarningConfirmDialog
          open={pendingDiscountCodeActivateRequest !== null}
          onClose={() => {
            setPendingDiscountCodeActivateRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "DISCOUNT_CODES:ACTIVATE",
              payload: pendingDiscountCodeActivateRequest!,
            });
            setPendingDiscountCodeActivateRequest(null);
          }}
          message="از فعال کردن این کد تخفیف مطمئن هستید؟"
          confirmButtonText="فعال کردن"
        />
        <WarningConfirmDialog
          open={pendingDiscountCodeInactivateRequest !== null}
          onClose={() => {
            setPendingDiscountCodeInactivateRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "DISCOUNT_CODES:INACTIVATE",
              payload: pendingDiscountCodeInactivateRequest!,
            });
            setPendingDiscountCodeInactivateRequest(null);
          }}
          message="از غیر فعال کردن این کد تخفیف مطمئن هستید؟"
          confirmButtonText="غیر فعال کردن"
        />
        <WarningConfirmDialog
          open={pendingDiscountCodeDeleteRequest !== null}
          onClose={() => {
            setPendingDiscountCodeDeleteRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "DISCOUNT_CODES:DELETE",
              payload: pendingDiscountCodeDeleteRequest!,
            });
            setPendingDiscountCodeDeleteRequest(null);
          }}
          message="از حذف این کد تخفیف مطمئن هستید؟"
          confirmButtonText="حذف"
        />
      </SectionContent>
    </DashboardLayout>
  );
}
