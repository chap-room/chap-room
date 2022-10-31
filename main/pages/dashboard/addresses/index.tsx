import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { deleteAddress, getAddresses } from "@/main/api";
import { Address } from "@/shared/types";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/Dashboard/DataLoader";
import IconButton from "@/shared/components/IconButton";
import Button from "@/shared/components/Button";
import TableControls from "@/shared/components/Dashboard/TableControls";
import AddressList from "@/shared/components/Dashboard/AddressList";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardAddresseList() {
  const router = useRouter();

  const [data, setData] = useState<{
    itemCount: number;
    addresses: Address[];
  }>({ itemCount: 0, addresses: [] });

  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    string | null
  >(null);

  const [reload, setRelaod] = useState(true);

  return (
    <>
      <Head>
        <title>داشبورد - آدرس ها</title>
      </Head>
      <SectionHeader
        title="آدرس ها"
        description="آدرس های خود را از این بخش مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="آدرس های من"
          end={
            <Link href="/dashboard/addresses/new">
              <Button style={{ padding: 0 }}>
                افزودن آدرس <AddIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
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
          load={() => {
            if (reload) {
              setRelaod(false);
              return getAddresses(itemPerPage, currentPage);
            }
          }}
          deps={[reload]}
          setData={setData}
        >
          {data.itemCount > 10 && (
            <TableControls
              itemPerPage={itemPerPage}
              setItemPerPage={setItemPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemCount={data.itemCount}
            />
          )}
          <AddressList
            addresses={data.addresses}
            onEditAddress={(addressId) =>
              router.push(`/dashboard/addresses/${addressId}/edit`)
            }
            onDeleteAddress={setPendingDeleteRequest}
          />
          {!data.addresses.length && (
            <EmptyNote>شما هیچ آدرسی ندارید</EmptyNote>
          )}
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
                setRelaod(true);
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
