import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { getProfile, updateProfile } from "@/admin/api";
import { useDashboardData } from "@/admin/context/dashboardData";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import ProfileForm from "@/shared/components/Dashboard/ProfileForm";

export default function DashboardProfile() {
  const dashboardData = useDashboardData();

  const [data, setData] = useState<{
    avatar: string | null;
    name: string;
    phoneNumber: string;
  }>({
    avatar: null,
    name: "",
    phoneNumber: "",
  });

  return (
    <>
      <Head>
        <title>داشبورد - پروفایل</title>
      </Head>
      <AdminSectionHeader
        title="پروفایل"
        description="ــ تنظیمات حساب خود را از این قسمت انجام دهید"
      />
      <SectionContent>
        <ContentHeader title="اطلاعات من" />
        <MobileContentHeader backTo="/dashboard" title="تنظیمات پروفایل" />
        <DataLoader load={() => getProfile()} setData={setData}>
          <ProfileForm
            canEditPhoneNumber
            defaultValues={{
              phoneNumber: data.phoneNumber,
              name: data.name,
            }}
            onSave={(userFormData) =>
              updateProfile(userFormData)
                .then((message) => {
                  toast.success(message);
                  dashboardData.loaderState.reload();
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardProfile.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
