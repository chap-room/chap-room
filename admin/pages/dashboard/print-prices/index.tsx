import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import PrintPricesTable from "@/admin/components/PrintPricesTable";
import { PrintColor, PrintSize } from "@/shared/types";

export default function DashboardPrintPricesList() {
  const data = useContext(DataContext);
  const router = useRouter();

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - تعرفه ها</title>
      </Head>
      <SectionHeader
        title="تعرفه ها"
        description="تعرفه های چاپ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="لیست تعرفه ها"
          end={
            <Link href="/dashboard/print-prices/binding">
              <Button style={{ padding: 0 }}>صحافی</Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard" title="لیست تعرفه ها" />
        <PrintPricesTable
          allPrintPrices={data.state.allPrintPrices}
          onEditPrintPrices={(printSize, printColor) => {
            router.push(
              `/dashboard/print-prices/${
                {
                  [PrintSize.a4]: "a4",
                  [PrintSize.a3]: "a3",
                  [PrintSize.a5]: "a5",
                }[printSize]
              }/${
                {
                  [PrintColor.blackAndWhite]: "black-and-white",
                  [PrintColor.normalColor]: "normal-color",
                  [PrintColor.fullColor]: "full-color",
                }[printColor]
              }/edit`
            );
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
