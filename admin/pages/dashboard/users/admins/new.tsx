import { ReactElement } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { newAdmin } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import AdminForm from "@/admin/components/AdminForm";

export default function DashboardNewAdmin() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>داشبورد - افزودن ادمین</title>
      </Head>
      <AdminSectionHeader
        title="ادمین ها"
        description="ــ افزودن و ویرایش ادمین ها از این قسمت"
      />
      <SectionContent>
        <ContentHeader
          title="افزودن ادمین جدید"
          end={
            <Link href="/dashboard/users/admins">
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/users/admins"
          title="افزودن ادمین جدید"
        />
        <AdminForm
          onSave={(adminFormData) =>
            newAdmin(adminFormData)
              .then((message) => {
                toast.success(message);
                router.push("/dashboard/users/admins");
              })
              .catch(toast.error)
          }
        />
      </SectionContent>
    </>
  );
}

DashboardNewAdmin.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
