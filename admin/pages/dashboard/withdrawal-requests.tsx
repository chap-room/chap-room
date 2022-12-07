import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import { WithdrawalRequest } from "@/shared/types";
import {
  doWithdrawalRequests,
  getWithdrawalRequests,
  rejectWithdrawalRequests,
} from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import { useDashboardData } from "@/admin/context/dashboardData";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import WithdrawalRequestTable from "@/admin/components/WithdrawalRequestTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WithdrawalRequestDoneDialog from "@/admin/components/WithdrawalRequestDoneDialog";
import WithdrawalRequestRejectDialog from "@/admin/components/WithdrawalRequestRejectDialog";

export default function DashboardWithdrawalRequests() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    withdrawals: WithdrawalRequest[];
  }>({ totalCount: 0, pageSize: 0, withdrawals: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsStatus, setItemsStatus] = useState<"done" | "rejected" | null>(
    null
  );

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (router.query.tab === "done" || router.query.tab === "rejected") {
          setItemsStatus(router.query.tab);
        }
        if (router.query.search) {
          setSearch(router.query.search as string);
        }
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

        if (itemsStatus) query.tab = itemsStatus;
        if (search) query.search = search;
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
  }, [router.isReady, itemsStatus, search, page]);

  const [
    pendingWithdrawalRequestDoneRequest,
    setPendingWithdrawalRequestDoneRequest,
  ] = useState<number | null>(null);
  const [
    pendingWithdrawalRequestRejectRequest,
    setPendingWithdrawalRequestRejectRequest,
  ] = useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  const title =
    itemsStatus === null
      ? "درخواست های در انتظار تأیید"
      : itemsStatus === "done"
      ? "درخواست های انجام شده"
      : itemsStatus === "rejected"
      ? "درخواست های رد شده"
      : "";

  return (
    <>
      <Head>
        <title>داشبورد - درخواست های برداشت</title>
      </Head>
      <AdminSectionHeader
        title="درخواست های برداشت"
        description="ــ در خواست های برداشت را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title={title}
          subTitle={
            data.totalCount
              ? `(${formatNumber(data.totalCount)})`
              : undefined
          }
          end={
            <SwitchButtons
              options={[
                {
                  id: "rejected",
                  label: "رد شده",
                  color: "#f20f4b",
                },
                {
                  id: "done",
                  label: "انجام شده",
                  color: "#14cc9c",
                },
              ]}
              value={itemsStatus}
              onChange={(newValue) => {
                setItemsStatus(newValue);
                setPage(1);
              }}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title={title} />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "جستجو کاربر با نام یا موبایل" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() =>
            getWithdrawalRequests(
              search,
              page,
              itemsStatus === null ? "pending" : itemsStatus
            )
          }
          deps={[search, page, itemsStatus]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <WithdrawalRequestTable
            withdrawalRequests={data.withdrawals}
            onDoneWithdrawalRequest={setPendingWithdrawalRequestDoneRequest}
            onRejectWithdrawalRequest={setPendingWithdrawalRequestRejectRequest}
            itemsStatus={itemsStatus === null ? "pending" : itemsStatus}
          />
          {!data.withdrawals.length && (
            <EmptyNote>هیچ درخواست برداشتی وجود ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          {pendingWithdrawalRequestDoneRequest !== null && (
            <WithdrawalRequestDoneDialog
              onClose={() => setPendingWithdrawalRequestDoneRequest(null)}
              onDoneWithdrawalRequest={(transactionDate, trackingCode) =>
                doWithdrawalRequests(
                  pendingWithdrawalRequestDoneRequest!,
                  trackingCode
                )
                  .then((message) => {
                    toast.success(message);
                    setPendingWithdrawalRequestDoneRequest(null);
                    if (reloadRef.current) reloadRef.current();
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
            />
          )}
          {pendingWithdrawalRequestRejectRequest !== null && (
            <WithdrawalRequestRejectDialog
              onClose={() => setPendingWithdrawalRequestRejectRequest(null)}
              onRejectWithdrawalRequest={(reason) =>
                rejectWithdrawalRequests(
                  pendingWithdrawalRequestRejectRequest!,
                  reason
                )
                  .then((message) => {
                    toast.success(message);
                    setPendingWithdrawalRequestRejectRequest(null);
                    if (reloadRef.current) reloadRef.current();
                    dashboardData.loaderState.reload();
                  })
                  .catch(toast.error)
              }
            />
          )}
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardWithdrawalRequests.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
