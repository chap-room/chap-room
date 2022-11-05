import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { deleteUser, getUsers } from "@/admin/api";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import IconButton from "@/shared/components/IconButton";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Button from "@/shared/components/Button";
import UserTable from "@/admin/components/UserTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import UserMarketingDetailsDialog from "@/admin/components/UserMarketingDetailsDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardUserList() {
  const router = useRouter();

  const [showAdminUsers, setShowAdminUsers] = useState<true | null>(null);
  const [showUserMarketingDetails, setShowUserMarketingDetails] = useState<
    number | null
  >(null);
  const [pendingUserDeleteRequest, setPendingUserDeleteRequest] = useState<
    number | null
  >(null);

  const [data, setData] = useState<{
    countOfItems: number;
    users: {
      id: number;
      name: string;
      phoneNumber: string;
      marketingBalance: number;
      walletBalance: number;
      countOfOrders: number;
    }[];
  }>({ countOfItems: 0, users: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [reload, setRelaod] = useState(true);

  return (
    <>
      <Head>
        <title>داشبورد - کاربران</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه کاربران"
          end={
            <>
              <SwitchButtons
                options={[
                  {
                    id: true,
                    label: "ادمین ها",
                  },
                ]}
                value={showAdminUsers}
                onChange={setShowAdminUsers}
                nullable
              />
              <Link href="/dashboard/users/new">
                <Button style={{ padding: 0 }}>
                  افزودن کاربر <AddIcon />
                </Button>
              </Link>
            </>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="همه کاربران"
          end={
            <Link href="/dashboard/users/new">
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
              return getUsers(search, page);
            }
          }}
          deps={[reload]}
          setData={setData}
        >
          <UserTable
            users={data.users}
            onSeeUserMarketingDetails={setShowUserMarketingDetails}
            onSeeUserOrderList={(userId) =>
              router.push(`/dashboard/users/${userId}/orders`)
            }
            onSeeUserAddressList={(userId) =>
              router.push(`/dashboard/users/${userId}/addresses`)
            }
            onDeleteUser={setPendingUserDeleteRequest}
            onLoginAsUser={(userId) =>
              router.push(`/dashboard/users/${userId}/edit`)
            }
            onEditUser={(userId) =>
              router.push(`/dashboard/users/${userId}/edit`)
            }
          />
          {!data.users.length && <EmptyNote>هیچ کاربری وجود ندارید</EmptyNote>}
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

DashboardUserList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
