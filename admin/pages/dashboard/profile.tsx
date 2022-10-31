import { useContext } from "react";
import Head from "next/head";
import { DataContext } from "@/admin/context/Data";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import UserForm from "@/shared/components/Dashboard/UserForm";

export default function DashboardProfile() {
  const data = useContext(DataContext);

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - پروفایل</title>
      </Head>
      <SectionHeader
        title="پروفایل"
        description="تنظیمات پروفایل خود را از این بخش تغییر دهید"
      />
      <SectionContent>
        <ContentHeader title="اطلاعات من" />
        <MobileContentHeader backTo="/dashboard" title="اطلاعات من" />
        <UserForm
          defaultValues={{
            phoneNumber: data.state.currentUser.phoneNumber,
            name: data.state.currentUser.name,
          }}
          onSave={(userFormData) => {
            // TODO
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
