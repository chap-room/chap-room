import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { createUserAccessToken, deleteUser, getUsers } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import ButtonList from "@/shared/components/ButtonList";
import Controls from "@/admin/components/Controls";
import UserTable from "@/admin/components/UserTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import UserMarketingDetailsDialog from "@/admin/components/UserMarketingDetailsDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardUserList() {
  const router = useRouter();

  const [showUserMarketingDetails, setShowUserMarketingDetails] = useState<
    number | null
  >(null);
  const [pendingUserDeleteRequest, setPendingUserDeleteRequest] = useState<
    number | null
  >(null);

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    users: {
      id: number;
      name: string;
      phoneNumber: string;
      marketingBalance: number;
      walletBalance: number;
      countOfOrders: number;
    }[];
  }>({ totalCount: 0, pageSize: 0, users: [] });

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
        <title>?????????????? - ??????????????</title>
      </Head>
      <AdminSectionHeader
        title="??????????????"
        description="???? ???????????? ?? ???????????? ?????????????? ???? ?????? ????????"
      />
      <SectionContent>
        <ContentHeader
          title="?????? ??????????????"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <ButtonList gap={15}>
              <Link href="/dashboard/users/admins">
                <Button
                  varient="content-title-outlined"
                  style={{ minWidth: 130 }}
                >
                  ?????????? ????
                </Button>
              </Link>
              <Link href="/dashboard/users/new">
                <Button varient="content-title-none">
                  ???????????? ??????????
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
          title="?????? ??????????????"
          end={
            <Link href="/dashboard/users/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "?????????? ?????????? ???? ?????? ???? ????????????" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() => getUsers(search, page)}
          deps={[search, page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <UserTable
            users={data.users}
            onSeeUserMarketingDetails={setShowUserMarketingDetails}
            onSeeUserOrderList={(userId) =>
              router.push(
                `/dashboard/users/${userId}/orders?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
            onSeeUserAddressList={(userId) =>
              router.push(
                `/dashboard/users/${userId}/addresses?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
            onDeleteUser={setPendingUserDeleteRequest}
            onLoginAsUser={(userId) => {
              const toastId = toast.loading("???????? ?????? ???????? ...");

              createUserAccessToken(userId)
                .then((token) => {
                  toast.dismiss(toastId);
                  window.open(
                    `${
                      process.env.MAIN_URL
                    }/login/by-access-token?accessToken=${encodeURIComponent(
                      token
                    )}`
                  );
                })
                .catch((message) =>
                  toast.error(message, {
                    id: toastId,
                  })
                );
            }}
            onEditUser={(userId) =>
              router.push(
                `/dashboard/users/${userId}/edit?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
          />
          {!data.users.length && <EmptyNote>?????? ???????????? ???????? ??????????</EmptyNote>}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <UserMarketingDetailsDialog
            open={showUserMarketingDetails !== null}
            onClose={() => {
              setShowUserMarketingDetails(null);
            }}
            userId={showUserMarketingDetails!}
          />
          <WarningConfirmDialog
            open={pendingUserDeleteRequest !== null}
            onClose={() => {
              setPendingUserDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteUser(pendingUserDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingUserDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="???? ?????? ?????? ?????????? ?????????? ????????????"
            confirmButtonText="??????"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardUserList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
