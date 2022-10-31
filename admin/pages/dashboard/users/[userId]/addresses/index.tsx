import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import AddressList from "@/shared/components/Dashboard/AddressList";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardUserAddressList() {
  const data = useContext(DataContext);
  const router = useRouter();
  const { userId } = router.query;
  const user = data.state.users.filter((item) => item.id === userId)[0];
  if (!user) return <></>; // TODO 404

  const [pendingAddressDeleteRequest, setPendingAddressDeleteRequest] =
    useState<string | null>(null);

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - آدرس ها</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="آدرس ها"
          end={
            <Link href="/dashboard/users">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard/users" title="آدرس ها" />
        <AddressList
          addresses={user.addresses}
          onEditAddress={(addressId) =>
            router.push(
              `/dashboard/users/${userId}/addresses/${addressId}/edit`
            )
          }
          onDeleteAddress={setPendingAddressDeleteRequest}
        />
        <WarningConfirmDialog
          open={pendingAddressDeleteRequest !== null}
          onClose={() => {
            setPendingAddressDeleteRequest(null);
          }}
          onConfirm={() => {
            data.dispatch({
              type: "USERS:UPDATE",
              payload: {
                ...user,
                addresses: user.addresses.filter(
                  (item) => item.id !== pendingAddressDeleteRequest
                ),
              },
            });
            setPendingAddressDeleteRequest(null);
          }}
          message="از حذف این آدرس مطمئن هستید؟"
          confirmButtonText="حذف"
        />
      </SectionContent>
    </DashboardLayout>
  );
}
