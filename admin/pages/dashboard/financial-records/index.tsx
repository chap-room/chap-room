import { ReactElement, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { FinancialRecord } from "@/shared/types";
import { deleteFinancialRecord, getFinancialRecords } from "@/admin/api";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import Filters from "@/admin/components/Filters";
import FilterDate from "@/admin/components/FilterDate";
import FilterSelect from "@/admin/components/FilterSelect";
import DataLoader from "@/shared/components/DataLoader";
import FinancialRecordTable from "@/admin/components/FinancialRecordTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardFinancialRecordList() {
  const intl = useIntl();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    records: FinancialRecord[];
  }>({
    totalCount: 0,
    pageSize: 0,
    records: [],
  });

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "successful" | "unsuccessful" | null
  >(null);
  const [page, setPage] = useState(1);

  const [
    pendingFinancialRecordCodeDeleteRequest,
    setPendingFinancialRecordCodeDeleteRequest,
  ] = useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - سوابق مالی</title>
      </Head>
      <SectionHeader
        title="سوابق مالی"
        description="ــ سوابق مالی را از این قسمت مدیریت کنید"
        isAdmin
      />
      <SectionContent>
        <ContentHeader
          title="لیست سوابق مالی"
          subTitle={
            data.totalCount
              ? `(${intl.formatNumber(data.totalCount)})`
              : undefined
          }
          end={
            <ButtonList gap={15}>
              <Link href="/dashboard/financial-records/total-income">
                <Button
                  varient="content-title-outlined"
                  style={{ minWidth: 130 }}
                >
                  درآمد کل
                </Button>
              </Link>
              <Link href="/dashboard/financial-records/new">
                <Button varient="content-title-none">
                  ایجاد سند
                  <FilledIconContainer style={{ marginRight: 10 }}>
                    <AddIcon />
                  </FilledIconContainer>
                </Button>
              </Link>
            </ButtonList>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="لیست سوابق مالی"
          end={
            <Link href="/dashboard/financial-records/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
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
          end={
            <Filters
              removeFilters={() => {
                setStartDate(null);
                setEndDate(null);
                setPaymentStatus(null);
                setPage(1);
              }}
              rows={[
                [
                  <FilterDate
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      setPage(1);
                    }}
                    width={140}
                    maxWidth={140}
                    placeholder="از تاریخ"
                  />,
                  <FilterDate
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                      setPage(1);
                    }}
                    width={140}
                    maxWidth={140}
                    placeholder="تا تاریخ"
                  />,
                  <FilterSelect
                    placeholder="وضعیت پرداخت"
                    options={{
                      successful: "موفق",
                      unsuccessful: "ناموفق",
                    }}
                    value={paymentStatus}
                    onChange={(newValue) => {
                      setPaymentStatus(newValue);
                      setPage(1);
                    }}
                    width={150}
                    maxWidth={150}
                  />,
                ],
              ]}
            />
          }
        />
        <DataLoader
          load={() =>
            getFinancialRecords(search, startDate, endDate, paymentStatus, page)
          }
          deps={[search, startDate, endDate, paymentStatus, page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <FinancialRecordTable
            financialRecords={data.records}
            onSeeDetails={(orderId) =>
              router.push(
                `/dashboard/orders/${orderId}/details?fromFinancialRecords=true`
              )
            }
            onEditFinancialRecord={(financialRecordId) =>
              router.push(
                `/dashboard/financial-records/${financialRecordId}/edit`
              )
            }
            onDeleteFinancialRecord={setPendingFinancialRecordCodeDeleteRequest}
          />
          {!data.records.length && <EmptyNote>هیچ سندی وجود ندارید</EmptyNote>}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingFinancialRecordCodeDeleteRequest !== null}
            onClose={() => {
              setPendingFinancialRecordCodeDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteFinancialRecord(pendingFinancialRecordCodeDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingFinancialRecordCodeDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="از حذف این سند مطمئن هستید؟"
            confirmButtonText="حذف"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardFinancialRecordList.getLayout = function getLayout(
  page: ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
