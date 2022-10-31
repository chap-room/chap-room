import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@/shared/components/IconButton";
import Switch from "@/shared/components/Switch";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Button from "@/shared/components/Button";
import UserTable from "@/admin/components/UserTable";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardUserList() {
  const data = useContext(DataContext);
  const router = useRouter();

  const [showAdminUsers, setShowAdminUsers] = useState<true | null>(null);
  const [pendingUserDeleteRequest, setPendingUserDeleteRequest] = useState<
    string | null
  >(null);

  return (
    <DashboardLayout>
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
        <Switch
          currentViewId={showAdminUsers}
          views={[
            {
              id: null,
              content: (
                <UserTable
                  users={data.state.users}
                  onSeeUserMarketingDetails={(userId) =>
                    router.push(`/dashboard/users/${userId}/marketing`)
                  }
                  onSeeUserOrderList={(userId) =>
                    router.push(`/dashboard/users/${userId}/orders`)
                  }
                  onSeeUserAddressList={(userId) =>
                    router.push(`/dashboard/users/${userId}/addresses`)
                  }
                  onDeleteUser={setPendingUserDeleteRequest}
                  onLogoutUser={(userId) =>
                    router.push(`/dashboard/users/${userId}/edit`)
                  }
                  onEditUser={(userId) =>
                    router.push(`/dashboard/users/${userId}/edit`)
                  }
                />
              ),
            },
            // {
            //   id: true,
            //   content: (
            //     <UserTable
            //       users={data.state.users}
            //       onSeeOrderDetails={(orderId) =>
            //         router.push(`/dashboard/orders/${orderId}/details`)
            //       }
            //     />
            //   ),
            // },
          ]}
        />
        <WarningConfirmDialog
          open={pendingUserDeleteRequest !== null}
          onClose={() => {
            setPendingUserDeleteRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "USERS:DELETE",
              payload: pendingUserDeleteRequest!,
            });
            setPendingUserDeleteRequest(null);
          }}
          message="از حذف این کاربر مطمئن هستید؟"
          confirmButtonText="حذف"
        />
      </SectionContent>
    </DashboardLayout>
  );
}
