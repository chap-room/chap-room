import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getTransactions } from "@/main/api";
import { Transaction } from "@/shared/types";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import TransactionTable from "@/main/components/Dashboard/TransactionTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import DataLoader from "@/shared/components/DataLoader";

export default function DashboardTransactions() {
  const router = useRouter();

  const [data, setData] = useState<{
    countOfItems: number;
    transactions: Transaction[];
  }>({ countOfItems: 0, transactions: [] });

  const [page, setPage] = useState(1);

  return (
    <>
      <Head>
        <title>داشبورد - تراکنش ها</title>
      </Head>
      <SectionHeader
        title="تراکنش ها"
        description="سوابق مالی خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader title="همه سوابق مالی" />
        <MobileContentHeader backTo="/dashboard" title="سوابق مالی" />
        <DataLoader
          load={() => getTransactions(page)}
          setData={setData}
        >
          <TransactionTable
            transactions={data.transactions}
            onSeeDetails={(orderId) => {
              router.push(`/dashboard/orders/${orderId}/details`);
            }}
          />
          {!data.transactions.length && (
            <EmptyNote>شما هیچ تراکنشی ندارید</EmptyNote>
          )}
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardTransactions.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};