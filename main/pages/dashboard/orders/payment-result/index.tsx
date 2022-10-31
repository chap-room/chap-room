import styles from "./style.module.scss";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import Button from "@/shared/components/Button";
import ButtonList from "@/shared/components/ButtonList";
import Link from "next/link";

export default function DashboardOrderPaymentResult() {
  const router = useRouter();
  const { isSuccessful, orderId } = router.query;

  return (
    <>
      <Head>
        <title>
          داشبورد - {isSuccessful === "true" ? "سفارش موفق" : "سفارش نا موفق"}
        </title>
      </Head>
      <SectionHeader
        title="سفارش ها"
        description="تاریخچه سفارشات خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <div className={styles.Container}>
          <h2>
            {isSuccessful === "true"
              ? "سفارش شما با موفقیت تکمیل شد"
              : "سفارش شما با موفقیت تکمیل نشد"}
          </h2>
          <p>شماره سفارش: {orderId}</p>
          <ButtonList>
            <Link href="/dashboard/orders">
              <Button>بازگشت به سفارش ها</Button>
            </Link>
            <Link href={`/dashboard/orders/${orderId}/details`}>
              <Button varient="filled">مشاهده جزئیات سفارش</Button>
            </Link>
          </ButtonList>
        </div>
      </SectionContent>
    </>
  );
}

DashboardOrderPaymentResult.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
