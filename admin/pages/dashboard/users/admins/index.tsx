import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { AdminUserRole } from "@/shared/types";
import { deleteAdmin, getAdmins } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import AdminTable from "@/admin/components/AdminTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardAdminList() {
  const router = useRouter();

  const [pendingAdminDeleteRequest, setPendingAdminDeleteRequest] = useState<
    number | null
  >(null);

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    admins: {
      id: number;
      name: string;
      phoneNumber: string;
      role: AdminUserRole;
    }[];
  }>({ totalCount: 0, pageSize: 0, admins: [] });

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

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - ادمین ها</title>
      </Head>
      <AdminSectionHeader
        title="ادمین ها"
        description="ــ افزودن و ویرایش ادمین ها از این قسمت"
      />
      <SectionContent>
        <ContentHeader
          title="همه ادمین ها"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <ButtonList gap={15}>
              <Link href="/dashboard/users">
                <Button
                  varient="content-title-outlined"
                  style={{ minWidth: 130 }}
                >
                  کاربران
                </Button>
              </Link>
              <Link href="/dashboard/users/admins/new">
                <Button varient="content-title-none">
                  افزودن ادمین
                  <FilledIconContainer style={{ marginRight: 10 }}>
                    <AddIcon />
                  </FilledIconContainer>
                </Button>
              </Link>
            </ButtonList>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/users"
          title="همه ادمین ها"
          end={
            <Link href="/dashboard/users/admins/new">
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
        />
        <DataLoader
          load={() => getAdmins(search, page)}
          deps={[search, page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <AdminTable
            admins={data.admins}
            onDeleteAdmin={setPendingAdminDeleteRequest}
            onEditAdmin={(adminId) =>
              router.push(
                `/dashboard/users/admins/${adminId}/edit?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
          />
          {!data.admins.length && <EmptyNote>هیچ ادمینی وجود ندارد</EmptyNote>}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingAdminDeleteRequest !== null}
            onClose={() => {
              setPendingAdminDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteAdmin(pendingAdminDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingAdminDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="از حذف این کاربر مطمئن هستید؟"
            confirmButtonText="حذف"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardAdminList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
