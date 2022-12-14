import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Discount } from "@/shared/types";
import { deleteDiscount, getDiscounts } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import DashboardLayout from "@/admin/components/Layout";
import AddIcon from "@/shared/assets/icons/add.svg";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import DiscountTable from "@/admin/components/DiscountTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardDiscountList() {
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    discounts: Discount[];
  }>({ totalCount: 0, pageSize: 0, discounts: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (router.query.search) {
          setSearch(router.query.search as string);
        }
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

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
  }, [router.isReady, search, page]);

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    number | null
  >(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>?????????????? - ?????????? ??????????</title>
      </Head>
      <AdminSectionHeader
        title="?????????? ??????????"
        description="???? ?????????? ?????????? ???? ???? ?????? ???????? ???????????? ????????"
      />
      <SectionContent>
        <ContentHeader
          title="?????? ?????????? ??????????"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <Link href="/dashboard/discounts/new">
              <Button varient="content-title-none">
                ?????????? ???? ??????????
                <FilledIconContainer style={{ marginRight: 10 }}>
                  <AddIcon />
                </FilledIconContainer>
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="?????? ?????????? ??????????"
          end={
            <Link href="/dashboard/discounts/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "?????????? ???? ????" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() => getDiscounts(search, page)}
          deps={[search, page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <DiscountTable
            discounts={data.discounts}
            onEditDiscount={(discountId) =>
              router.push(
                `/dashboard/discounts/${discountId}/edit?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
            onDeleteDiscount={setPendingDeleteRequest}
          />
          {!data.discounts.length && (
            <EmptyNote>?????? ???? ???????????? ???????? ??????????</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingDeleteRequest !== null}
            onClose={() => {
              setPendingDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteDiscount(pendingDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="???? ?????? ?????? ???? ?????????? ?????????? ????????????"
            confirmButtonText="??????"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardDiscountList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
