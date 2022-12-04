import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Transaction } from "@/shared/types";
import { getTransactions } from "@/main/api";
import { useLastPage } from "@/shared/context/lastPage";
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

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

        if (page > 1) query.page = page.toString();

        router.push(
          {
            pathname: router.pathname,
            query,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, page]);

  return (
    <>
      <Head>
        <title>داشبورد - تراکنش های انجام شده</title>
      </Head>
      <SectionHeader
        title="تراکنش های انجام شده"
        description="ــ سوابق مالی خود را از این قسمت مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader title="همه سوابق مالی" />
        <MobileContentHeader
          backTo={useLastPage("/dashboard")}
          title="تراکنش های انجام شده"
        />
        <DataLoader
          load={() => getTransactions(page)}
          deps={[page]}
          setData={setData}
        >
          <TransactionTable
            transactions={data.transactions}
            onSeeDetails={(orderId) => {
              router.push(`/dashboard/orders/${orderId}/details`);
            }}
          />
          {!data.transactions.length && (
            <EmptyNote>هیچ تراکنشی وجود ندارد</EmptyNote>
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
