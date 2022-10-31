import { useContext, useState } from "react";
import Head from "next/head";
import { DataContext } from "@/admin/context/Data";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import DedicatedLinkReportTable from "@/admin/components/DedicatedLinkReportTable";
import DedicatedDiscountCodeReportTable from "@/admin/components/DedicatedDiscountCodeReportTable";

export default function DashboardMarketingReport() {
  const data = useContext(DataContext);

  const [tab, setTab] = useState<"link" | "discount-code">("link");

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - گزارش بازاریابی</title>
      </Head>
      <SectionHeader
        title="گزارش بازاریابی"
        description="گزارش بازاریابی را از این بخش مشاهده کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه گزارش ها"
          end={
            <SwitchButtons
              options={[
                {
                  id: "link",
                  label: "لینک اختصاصی",
                },
                {
                  id: "discount-code",
                  label: "کد تخفیف اختصاصی",
                },
              ]}
              value={tab}
              onChange={setTab}
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه گزارش ها" />
        {tab === "link" && (
          <DedicatedLinkReportTable
            dedicatedLinkReports={data.state.dedicatedLinkReports}
          />
        )}
        {tab === "discount-code" && (
          <DedicatedDiscountCodeReportTable
            dedicatedDiscountCodeReports={
              data.state.dedicatedDiscountCodeReports
            }
          />
        )}
      </SectionContent>
    </DashboardLayout>
  );
}
