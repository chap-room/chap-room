import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { getUser, updateUser } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import UserForm from "@/admin/components/UserForm";

export default function DashboardEditUser() {
  const router = useRouter();
  const userId = parseInt(router.query.userId as string);

  const [data, setData] = useState({
    phoneNumber: "",
    name: "",
    walletBalance: 0,
  });

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش کاربر</title>
      </Head>
      <AdminSectionHeader
        title="کاربران"
        description="ــ افزودن و ویرایش کاربران از این قسمت"
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن کاربر"
          end={
            <Link
              href={
                typeof router.query.from === "string"
                  ? router.query.from
                  : "/dashboard/users"
              }
            >
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={
            typeof router.query.from === "string"
              ? router.query.from
              : "/dashboard/users"
          }
          title="ویرایش کردن کاربر"
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getUser(userId);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <UserForm
            defaultValues={data}
            isEdit={true}
            onSave={(userFormData) =>
              updateUser(userId, userFormData)
                .then((message) => {
                  toast.success(message);
                  router.push("/dashboard/users");
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardEditUser.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
