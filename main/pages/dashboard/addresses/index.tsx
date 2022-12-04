import { ReactElement, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Address } from "@/shared/types";
import { deleteAddress, getAddresses } from "@/main/api";
import { useLastPage } from "@/shared/context/lastPage";
import AddressesIcon from "@/main/assets/icons/addresses.svg";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import AddressList from "@/shared/components/Dashboard/AddressList";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardAddresseList() {
  const intl = useIntl();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    addresses: Address[];
  }>({ totalCount: 0, pageSize: 0, addresses: [] });

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

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    number | null
  >(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - آدرس های من</title>
      </Head>
      <SectionHeader
        title="آدرس های من"
        description="ــ آدرس های خود را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="کل آدرس های من"
          subTitle={
            data.totalCount
              ? `(${intl.formatNumber(data.totalCount)})`
              : undefined
          }
          end={
            <Link href="/dashboard/addresses/new">
              <Button varient="content-title-none">
                افزودن آدرس
                <FilledIconContainer style={{ marginRight: 10 }}>
                  <AddressesIcon />
                </FilledIconContainer>
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={useLastPage("/dashboard")}
          title="آدرس های من"
          end={
            <Link href="/dashboard/addresses/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <DataLoader
          load={() => getAddresses(page)}
          deps={[page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <AddressList
            addresses={data.addresses}
            onEditAddress={(addressId) =>
              router.push(`/dashboard/addresses/${addressId}/edit`)
            }
            onDeleteAddress={setPendingDeleteRequest}
          />
          {!data.addresses.length && (
            <EmptyNote>هیچ آدرسی وجود ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        </DataLoader>
        <WarningConfirmDialog
          open={pendingDeleteRequest !== null}
          onClose={() => {
            setPendingDeleteRequest(null);
          }}
          onConfirm={() =>
            deleteAddress(pendingDeleteRequest!)
              .then((message) => {
                toast.success(message);
                setPendingDeleteRequest(null);
                if (reloadRef.current) reloadRef.current();
              })
              .catch(toast.error)
          }
          message="از حذف این آدرس مطمئن هستید؟"
          confirmButtonText="حذف"
        />
      </SectionContent>
    </>
  );
}

DashboardAddresseList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
