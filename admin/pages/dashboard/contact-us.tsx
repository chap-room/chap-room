import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import { ContactUsRequest } from "@/shared/types";
import { doContactUsRequest, getContactUsRequests } from "@/admin/api";
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
import ContactUsRequestTable from "@/admin/components/ContactUsRequestTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardContactUsRequests() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    contactUs: ContactUsRequest[];
  }>({ totalCount: 0, pageSize: 0, contactUs: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsStatus, setItemsStatus] = useState<"checked" | null>(null);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (router.query.tab === "checked") {
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
    pendingContactUsRequestDoRequest,
    setPendingContactUsRequestDoRequest,
  ] = useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - تماس با ما</title>
      </Head>
      <AdminSectionHeader
        title="تماس با ما"
        description="ــ در خواست های تماس با ما را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="درخواست های تماس با ما"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <SwitchButtons
              options={[
                {
                  id: null,
                  label: "انجام نشده",
                  color: "#f20f4b",
                },
                {
                  id: "checked",
                  label: "انجام شده",
                  color: "#14cc9c",
                },
              ]}
              value={itemsStatus}
              onChange={(newValue) => {
                setItemsStatus(newValue);
                setPage(1);
              }}
            />
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="درخواست های تماس با ما"
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
        <DataLoader
          load={() =>
            getContactUsRequests(search, page, itemsStatus === "checked")
          }
          deps={[search, page, itemsStatus]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <ContactUsRequestTable
            contactUsRequests={data.contactUs}
            onDoContactUsRequest={setPendingContactUsRequestDoRequest}
            itemsStatus={itemsStatus}
          />
          {!data.contactUs.length && (
            <EmptyNote>هیچ درخواست تماس با ما وجود ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingContactUsRequestDoRequest !== null}
            onClose={() => {
              setPendingContactUsRequestDoRequest(null);
            }}
            onConfirm={() =>
              doContactUsRequest(pendingContactUsRequestDoRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingContactUsRequestDoRequest(null);
                  if (reloadRef.current) reloadRef.current();
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
            message="از انجام این درخواست تماس با ما مطمئن هستید؟"
            confirmButtonText="انجام دادن"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardContactUsRequests.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
