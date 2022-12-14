import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { PrintTariffs } from "@/shared/types";
import { getPrintTariffs } from "@/admin/api";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import PrintTariffsTable from "@/admin/components/PrintTariffsTable";

export default function DashboardPrintPricesList() {
  const router = useRouter();

  const [data, setData] = useState<PrintTariffs>();

  return (
    <>
      <Head>
        <title>داشبورد - تعرفه های پرینت</title>
      </Head>
      <AdminSectionHeader
        title="تعرفه های پرینت"
        description="ــ تعرفه های پرینت را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="لیست تعرفه ها"
          end={
            <Link href="/dashboard/print-tariffs/binding">
              <Button varient="content-title-none">صحافی</Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard" title="لیست تعرفه ها" />
        <DataLoader load={() => getPrintTariffs()} setData={setData}>
          <PrintTariffsTable
            printTariffs={data!}
            onEditPrintPrices={(size, color) =>
              router.push(
                `/dashboard/print-tariffs/${size}/${
                  {
                    blackAndWhite: "black-and-white",
                    normalColor: "normal-color",
                    fullColor: "full-color",
                  }[color]
                }/edit`
              )
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardPrintPricesList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
