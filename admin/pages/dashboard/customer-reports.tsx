import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { DataContext } from "@/admin/context/Data";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import CustomerReportTable from "@/admin/components/CustomerReportTable";

export default function DashboardCustomerReport() {
  const data = useContext(DataContext);
  const router = useRouter();

  const customerReports = data.state.customerReports;

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - گزارش مشتریان</title>
      </Head>
      <SectionHeader
        title="گزارش مشتریان"
        description="گزارش مشتریان را از این بخش مشاهده کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader title="همه گزارش ها" />
        <MobileContentHeader backTo="/dashboard" title="همه گزارش ها" />
        <CustomerReportTable
          customerReports={customerReports}
          onSeeUserOrderList={(userId) =>
            router.push(`/dashboard/users/${userId}/orders`)
          }
        />
      </SectionContent>
    </DashboardLayout>
  );
}
