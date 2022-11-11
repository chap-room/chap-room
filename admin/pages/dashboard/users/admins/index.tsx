import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { AdminUserRole } from "@/shared/types";
import { deleteAdmin, getAdmins } from "@/admin/api";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import IconButton from "@/shared/components/IconButton";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import AdminTable from "@/admin/components/AdminTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardAdminList() {
  const router = useRouter();

  const [pendingAdminDeleteRequest, setPendingAdminDeleteRequest] = useState<
    number | null
  >(null);

  const [data, setData] = useState<{
    countOfItems: number;
    admins: {
      id: number;
      name: string;
      phoneNumber: string;
      role: AdminUserRole;
    }[];
  }>({ countOfItems: 0, admins: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [reload, setRelaod] = useState(true);

  return (
    <>
      <Head>
        <title>داشبورد - ادمین ها</title>
      </Head>
      <SectionHeader
        title="ادمین ها"
        description="ادمین ها را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه ادمین ها"
          end={
            <ButtonList>
              <Link href="/dashboard/users">
                <Button varient="filled">کاربران</Button>
              </Link>
              <Link href="/dashboard/users/admins/new">
                <Button style={{ padding: 0 }}>
                  افزودن ادمین <AddIcon />
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
        <DataLoader
          load={() => {
            if (reload) {
              setRelaod(false);
              return getAdmins(search, page);
            }
          }}
          deps={[reload]}
          setData={setData}
        >
          <AdminTable
            admins={data.admins}
            onDeleteAdmin={setPendingAdminDeleteRequest}
            onLoginAsAdmin={(adminId) =>
              router.push(`/dashboard/users/admins/${adminId}/edit`)
            }
            onEditAdmin={(adminId) =>
              router.push(`/dashboard/users/admins/${adminId}/edit`)
            }
          />
          {!data.admins.length && <EmptyNote>هیچ ادمینی وجود ندارید</EmptyNote>}
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
                  setRelaod(true);
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
