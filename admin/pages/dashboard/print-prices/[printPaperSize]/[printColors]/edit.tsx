import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { PrintSize, PrintColor } from "@/shared/types";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import PrintPricesForm from "@/admin/components/PrintPricesForm";

interface DashboardEditPrintPricesProps {
  printSize: PrintSize;
  printColor: PrintColor;
}

export default function DashboardEditPrintPrices() {
  const data = useContext(DataContext);

  const router = useRouter();
  const printSize =
    PrintSize[router.query.printSize as "a4" | "a3" | "a5"];
  const printColor = {
    "black-and-white": PrintColor.blackAndWhite,
    "normal-color": PrintColor.normalColor,
    "full-color": PrintColor.fullColor,
  }[router.query.printColor as string];
  if (!printSize || !printColor) return <></>; // TODO 404
  const printPrices = data.state.allPrintPrices[printSize][printColor];

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - ویرایش تعرفه ها</title>
      </Head>
      <SectionHeader
        title="تعرفه ها"
        description="تعرفه های چاپ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن تعرفه ها"
          end={
            <Link href="/dashboard/print-prices">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/print-prices"
          title="ویرایش کردن تعرفه ها"
        />
        <PrintPricesForm
          printSize={printSize}
          printColor={printColor}
          defaultValues={printPrices}
          onSave={(PrintPricesData) => {
            data.dispatch({
              type: "ALL_PRINT_PRICES:UPDATE",
              payload: {
                ...data.state.allPrintPrices,
                [printSize]: {
                  ...data.state.allPrintPrices[printSize],
                  [printColor]: PrintPricesData,
                },
              },
            });
            router.push("/dashboard/print-prices");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
