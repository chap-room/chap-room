import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Address, User } from "@/shared/types";
import { deleteAddress, getUserAddresses } from "@/admin/api";
import { useLastPage } from "@/shared/context/lastPage";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import AddressList from "@/shared/components/Dashboard/AddressList";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardUserAddressList() {
  const router = useRouter();
  const userId = parseInt(router.query.userId as string); // TODO 404

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    user: User | null;
    addresses: Address[];
  }>({ totalCount: 0, pageSize: 0, user: null, addresses: [] });

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

  const [pendingAddressDeleteRequest, setPendingAddressDeleteRequest] =
    useState<number | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - آدرس ها</title>
      </Head>
      <AdminSectionHeader
        title="کاربران"
        description="ــ افزودن و ویرایش کاربران از این قسمت"
      />
      <SectionContent>
        <ContentHeader
          title="آدرس ها"
          subTitle={
            data.user
              ? `(${data.user.name} / ${englishToPersianNumbers(
                  data.user.phoneNumber
                )})`
              : undefined
          }
          end={
            <Link href={useLastPage("/dashboard/users")}>
              <Button varient="none" style={{ padding: 0 }}>
                بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={useLastPage("/dashboard/users")}
          title="آدرس ها"
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getUserAddresses(userId, page);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <AddressList
            addresses={data.addresses}
            onEditAddress={(addressId) =>
              router.push(
                `/dashboard/users/${userId}/addresses/${addressId}/edit`
              )
            }
            onDeleteAddress={setPendingAddressDeleteRequest}
          />
          {!data.addresses.length && (
            <EmptyNote>این کاربر هیچ آدرسی ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingAddressDeleteRequest !== null}
            onClose={() => {
              setPendingAddressDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteAddress(pendingAddressDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingAddressDeleteRequest(null);
                })
                .catch(toast.error)
            }
            message="از حذف این آدرس مطمئن هستید؟"
            confirmButtonText="حذف"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardUserAddressList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
