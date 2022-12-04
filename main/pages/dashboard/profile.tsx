import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { getProfile, updateProfile } from "@/main/api";
import { useDashboardData } from "@/admin/context/dashboardData";
import { useLastPage } from "@/shared/context/lastPage";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
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
      <SectionHeader
        title="پروفایل"
        description="ــ تنظیمات حساب خود را از این قسمت انجام دهید"
      />
      <SectionContent>
        <ContentHeader title="اطلاعات من" />
        <MobileContentHeader
          backTo={useLastPage("/dashboard")}
          title="اطلاعات من"
        />
        <DataLoader load={() => getProfile()} setData={setData}>
          <ProfileForm
            inputsVarient="shadow"
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
