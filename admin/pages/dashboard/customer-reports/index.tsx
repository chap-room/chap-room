import styles from "./style.module.scss";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import { CustomerReport } from "@/shared/types";
import { getCustomerReports, getCustomerReportsExcel } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import DownloadIcon from "@/admin/assets/icons/download.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import Filters from "@/admin/components/Filters";
import FilterSelect from "@/admin/components/FilterSelect";
import DataLoader from "@/shared/components/DataLoader";
import CustomerReportTable from "@/admin/components/CustomerReportTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";

export default function DashboardCustomerReport() {
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    totalCreditor: number;
    totalDebtor: number;
    totalOrdersCount: number;
    reports: CustomerReport[];
  }>({
    totalCount: 0,
    pageSize: 0,
    totalCreditor: 0,
    totalDebtor: 0,
    totalOrdersCount: 0,
    reports: [],
  });

  const [paperSize, setPaperSize] = useState<"a4" | "a5" | "a3" | null>(null);
  const [paperColor, setPaperColor] = useState<
    "blackAndWhite" | "fullColor" | "normalColor" | null
  >(null);
  const [paperSide, setPaperSide] = useState<
    | "singleSided"
    | "doubleSided"
    | "singleSidedGlossy"
    | "doubleSidedGlossy"
    | null
  >(null);
  const [sortOrder, setSortOrder] = useState<
    | "withoutOrder"
    | "oneOrder"
    | "twoOrder"
    | "threeAndMoreOrder"
    | "mostToLowestOrder"
    | "lowestToMostOrder"
    | "mostToLowestBalance"
    | "lowestToMostBalance"
    | "mostToLowestPayment"
    | "lowestToMostPayment"
  >("mostToLowestOrder");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (
          router.query.paperSize === "a4" ||
          router.query.paperSize === "a5" ||
          router.query.paperSize === "a3"
        ) {
          setPaperSize(router.query.paperSize);
        }
        if (
          router.query.paperColor === "blackAndWhite" ||
          router.query.paperColor === "fullColor" ||
          router.query.paperColor === "normalColor"
        ) {
          setPaperColor(router.query.paperColor);
        }
        if (
          router.query.paperSide === "singleSided" ||
          router.query.paperSide === "doubleSided" ||
          router.query.paperSide === "singleSidedGlossy" ||
          router.query.paperSide === "doubleSidedGlossy"
        ) {
          setPaperSide(router.query.paperSide);
        }
        if (
          router.query.sortOrder === "withoutOrder" ||
          router.query.sortOrder === "oneOrder" ||
          router.query.sortOrder === "twoOrder" ||
          router.query.sortOrder === "threeAndMoreOrder" ||
          router.query.sortOrder === "mostToLowestOrder" ||
          router.query.sortOrder === "lowestToMostOrder" ||
          router.query.sortOrder === "mostToLowestBalance" ||
          router.query.sortOrder === "lowestToMostBalance" ||
          router.query.sortOrder === "mostToLowestPayment" ||
          router.query.sortOrder === "lowestToMostPayment"
        ) {
          setSortOrder(router.query.sortOrder);
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

        if (paperSize) query.paperSize = paperSize;
        if (paperColor) query.paperColor = paperColor;
        if (paperSide) query.paperSide = paperSide;
        if (sortOrder !== "mostToLowestOrder") query.sortOrder = sortOrder;
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
  }, [
    router.isReady,
    paperSize,
    paperColor,
    paperSide,
    sortOrder,
    search,
    page,
  ]);

  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  function generatrExcel() {
    setIsGeneratingExcel(true);
    getCustomerReportsExcel(search, paperSize, paperColor, paperSide, sortOrder)
      .then(window.open)
      .catch(toast.error)
      .finally(() => setIsGeneratingExcel(false));
  }

  return (
    <>
      <Head>
        <title>داشبورد - گزارش مشتریان</title>
      </Head>
      <AdminSectionHeader
        title="گزارش مشتریان"
        description="ــ گزارش مشتریان را از این قسمت مشاهده کنید"
      />
      <SectionContent>
        <ContentHeader
          title="کاربران"
          subTitle={
            <div className={styles.SubTitle}>
              <div style={{ color: "#9c9c9c", fontSize: 13, fontWeight: 400 }}>
                مجموع بر اساس فیلتر:
              </div>
              <div>
                تعداد: {formatNumber(data.totalCount)} کاربر -{" "}
                {formatNumber(data.totalOrdersCount)} سفارش
              </div>
              <div>(بستانکار کل: {formatNumber(data.totalCreditor)} تومان)</div>
              <div style={{ color: "#f20f4b" }}>
                (بدهکار کل: {formatNumber(data.totalDebtor)} تومان)
              </div>
            </div>
          }
          end={
            !isGeneratingExcel ? (
              <Button
                varient="content-title-none"
                style={{ padding: 0 }}
                disabled={isGeneratingExcel}
                loading={isGeneratingExcel}
                onClick={() => generatrExcel()}
              >
                دانلود اکسل براساس فیلتر
                <FilledIconContainer style={{ marginRight: 10 }}>
                  <DownloadIcon />
                </FilledIconContainer>
              </Button>
            ) : (
              <IconButton loading={true} varient="filled" size={34} />
            )
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="کاربران"
          end={
            <IconButton
              varient="filled"
              disabled={isGeneratingExcel}
              loading={isGeneratingExcel}
              onClick={() => generatrExcel()}
            >
              <DownloadIcon />
            </IconButton>
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
                setPaperSize(null);
                setPaperColor(null);
                setPaperSide(null);
                setPage(1);
              }}
              rows={[
                [
                  <FilterSelect
                    placeholder="اندازه"
                    options={{
                      a4: "A4",
                      a5: "A5",
                      a3: "A3",
                    }}
                    value={paperSize}
                    onChange={(newValue) => {
                      setPaperSize(newValue);
                      setPage(1);
                    }}
                    width={130}
                    maxWidth={130}
                  />,
                  <FilterSelect
                    placeholder="رنگ"
                    options={{
                      blackAndWhite: "سیاه و سفید",
                      fullColor: "تمام رنگی",
                      normalColor: "رنگ معمولی",
                    }}
                    value={paperColor}
                    onChange={(newValue) => {
                      setPaperColor(newValue);
                      setPage(1);
                    }}
                    width={130}
                    maxWidth={130}
                  />,
                  <FilterSelect
                    placeholder="یک رو / دو رو"
                    options={{
                      singleSided: "یک رو",
                      doubleSided: "دو رو",
                      singleSidedGlossy: "یک رو گلاسه",
                      doubleSidedGlossy: "دو رو گلاسه",
                    }}
                    value={paperSide}
                    onChange={(newValue) => {
                      setPaperSide(newValue);
                      setPage(1);
                    }}
                    width={130}
                    maxWidth={130}
                  />,
                ],
                [
                  <FilterSelect
                    options={{
                      mostToLowestOrder: "بیشترین به کمترین تعداد سفارش",
                      lowestToMostOrder: "کمترین به بیشترین تعداد سفارش",
                      mostToLowestBalance: "بیشترین به کمترین موجودی",
                      lowestToMostBalance: "کمترین به بیشترین موجودی",
                      mostToLowestPayment: "بیشترین به کمترین پرداختی",
                      lowestToMostPayment: "کمترین به بیشترین پرداختی",
                      withoutOrder: "بدون سفارش",
                      oneOrder: "1 سفارش",
                      twoOrder: "2 سفارش",
                      threeAndMoreOrder: "3 سفارش و بیشتر",
                    }}
                    value={sortOrder}
                    onChange={(newValue) => {
                      setSortOrder(newValue);
                      setPage(1);
                    }}
                    width={250}
                    maxWidth={250}
                  />,
                ],
              ]}
            />
          }
        />
        <DataLoader
          load={() =>
            getCustomerReports(
              search,
              paperSize,
              paperColor,
              paperSide,
              sortOrder,
              page
            )
          }
          deps={[search, paperSize, paperColor, paperSide, sortOrder, page]}
          setData={setData}
        >
          <CustomerReportTable
            customerReports={data.reports}
            onSeeUserOrderList={(userId) =>
              router.push(
                `/dashboard/users/${userId}/orders?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
          />
          {!data.reports.length && <EmptyNote>هیچ گزارشی وجود ندارد</EmptyNote>}
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

DashboardCustomerReport.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
