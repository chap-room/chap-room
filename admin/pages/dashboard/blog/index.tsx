// import styles from "./style.module.scss";
import { ReactElement } from "react";
import Head from "next/head";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";

export default function DashboardBlog() {
  return (
    <>
      <Head>
        <title>داشبورد - وبلاگ</title>
      </Head>
      <SectionHeader
        title="وبلاگ"
        description="وبلاگ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader title="همه نوشته ها" />
        <MobileContentHeader backTo="/dashboard" title="همه نوشته ها" />
      </SectionContent>
    </>
  );
}

DashboardBlog.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
