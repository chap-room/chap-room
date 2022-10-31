import { useContext } from "react";
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
import UserForm from "@/shared/components/Dashboard/UserForm";

export default function DashboardEditUser() {
  const data = useContext(DataContext);
  const router = useRouter();
  const { userId } = router.query;
  const user = data.state.users.filter((item) => item.id === userId)[0];

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ویرایش کاربر</title>
      </Head>
      <SectionHeader
        title="کاربران"
        description="کاربران را از این بخش اضافه و ویرایش کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن کاربر"
          end={
            <Link href="/dashboard/users">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/users"
          title="ویرایش کردن کاربر"
        />
        <UserForm
          defaultValues={user}
          onSave={(userFormData) => {
            data.dispatch({
              type: "USERS:UPDATE",
              payload: {
                ...user,
                ...userFormData,
              },
            });
            router.push("/dashboard/users");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
