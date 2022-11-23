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
import DataLoader from "@/shared/components/DataLoader";
import TransactionTable from "@/main/components/Dashboard/TransactionTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";

export default function DashboardTransactions() {
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    transactions: Transaction[];
  }>({ totalCount: 0, pageSize: 0, transactions: [] });

  const [page, setPage] = useState(1);

  return (
    <>
      <Head>
        <title>داشبورد - تراکنش های انجام شده</title>
      </Head>
      <SectionHeader
        title="تراکنش های انجام شده"
        description="ــ سوابق مالی خود را از این بخش مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader title="همه سوابق مالی" />
        <MobileContentHeader backTo="/dashboard" title="تراکنش ها" />
        <DataLoader
          load={() => getTransactions(page)}
          deps={[page]}
          setData={setData}
        >
          <TransactionTable
            transactions={data.transactions}
            onSeeDetails={(orderId) => {
              router.push(
                `/dashboard/orders/${orderId}/details?fromTransactions=true`
              );
            }}
          />
          {!data.transactions.length && (
            <EmptyNote>شما هیچ تراکنشی ندارید</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardTransactions.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
