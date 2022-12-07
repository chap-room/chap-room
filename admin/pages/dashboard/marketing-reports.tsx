import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  DedicatedDiscountCodeReport,
  DedicatedLinkReport,
} from "@/shared/types";
import {
  getDedicatedDiscountCodeReports,
  getDedicatedLinkReports,
} from "@/admin/api";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import DedicatedLinkReportTable from "@/admin/components/DedicatedLinkReportTable";
import DedicatedDiscountCodeReportTable from "@/admin/components/DedicatedDiscountCodeReportTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";

export default function DashboardMarketingReport() {
  const router = useRouter();
  const [tab, setTab] = useState<"link" | "discount-code">("link");

  const [dedicatedLinkData, setDedicatedLinkData] = useState<{
    totalCount: number;
    pageSize: number;
    reports: DedicatedLinkReport[];
  }>({ totalCount: 0, pageSize: 0, reports: [] });

  const [dedicatedDiscountCodeData, setDedicatedDiscountCodeData] = useState<{
    totalCount: number;
    pageSize: number;
    reports: DedicatedDiscountCodeReport[];
  }>({ totalCount: 0, pageSize: 0, reports: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (
          router.query.tab === "link" ||
          router.query.tab === "discount-code"
        ) {
          setTab(router.query.tab);
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

        if (tab) query.tab = tab;
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
  }, [router.isReady, tab, search, page]);

  return (
    <>
      <Head>
        <title>داشبورد - گزارش بازاریابی</title>
      </Head>
      <AdminSectionHeader
        title="گزارش بازاریابی"
        description="ــ بازاریابی کاربران را از این قسمت مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader
          title="گزارش ها"
          subTitle={
            tab === "discount-code"
              ? dedicatedDiscountCodeData.totalCount
                ? `(${dedicatedDiscountCodeData.totalCount})`
                : undefined
              : dedicatedLinkData.totalCount
              ? `(${dedicatedLinkData.totalCount})`
              : undefined
          }
          end={
            <SwitchButtons
              options={[
                {
                  id: "link",
                  label: "لینک اختصاصی",
                },
                {
                  id: "discount-code",
                  label: "کد تخفیف اختصاصی",
                },
              ]}
              value={tab}
              onChange={(newTab) => {
                setTab(newTab);
                setPage(1);
              }}
            />
          }
        />
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
        <MobileContentHeader
          backTo="/dashboard"
          title="گزارش ها"
        />
        {tab === "link" && (
          <DataLoader
            load={() => getDedicatedLinkReports(search, page)}
            deps={[search, page]}
            setData={setDedicatedLinkData}
          >
            <DedicatedLinkReportTable
              dedicatedLinkReports={dedicatedLinkData.reports}
            />
            {!dedicatedLinkData.reports.length && (
              <EmptyNote>هیچ گزارشی وجود ندارد</EmptyNote>
            )}
            <Pagination
              currentPage={page}
              totalCount={dedicatedLinkData.totalCount}
              pageSize={dedicatedLinkData.pageSize}
              onPageChange={setPage}
            />
          </DataLoader>
        )}
        {tab === "discount-code" && (
          <DataLoader
            load={() => getDedicatedDiscountCodeReports(search, page)}
            deps={[search, page]}
            setData={setDedicatedDiscountCodeData}
          >
            <DedicatedDiscountCodeReportTable
              dedicatedDiscountCodeReports={dedicatedDiscountCodeData.reports}
            />
            {!dedicatedDiscountCodeData.reports.length && (
              <EmptyNote>هیچ گزارشی وجود ندارد</EmptyNote>
            )}
            <Pagination
              currentPage={page}
              totalCount={dedicatedDiscountCodeData.totalCount}
              pageSize={dedicatedDiscountCodeData.pageSize}
              onPageChange={setPage}
            />
          </DataLoader>
        )}
      </SectionContent>
    </>
  );
}

DashboardMarketingReport.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
