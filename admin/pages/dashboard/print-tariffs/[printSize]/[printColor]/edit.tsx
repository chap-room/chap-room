import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { PrintTariffs } from "@/shared/types";
import { getPrintTariffs, updatePrintTariffs } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import PrintPriceForm from "@/admin/components/PrintPriceForm";

export default function DashboardEditPrintPrices() {
  const router = useRouter();
  const printSize = router.query.printSize as "a4" | "a5" | "a3";
  const printColor = {
    "black-and-white": "blackAndWhite" as const,
    "normal-color": "normalColor" as const,
    "full-color": "fullColor" as const,
  }[router.query.printColor as string];

  if (!["a4", "a5", "a3"].includes(printSize) || !printColor) {
    /* TODO 404 */
    return <></>;
  }

  const [data, setData] = useState<PrintTariffs>();

  const printPrice = data ? data[printSize][printColor] : undefined;

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش تعرفه ها</title>
      </Head>
      <AdminSectionHeader
        title="تعرفه های پرینت"
        description="ــ تعرفه های پرینت را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن تعرفه ها"
          end={
            <Link href="/dashboard/print-tariffs">
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/print-tariffs"
          title="ویرایش کردن تعرفه ها"
        />
        <DataLoader load={() => getPrintTariffs()} setData={setData}>
          <PrintPriceForm
            printSize={printSize}
            printColor={printColor}
            defaultValues={printPrice!}
            onSave={(printPriceData) =>
              updatePrintTariffs({
                ...data!,
                [printSize]: {
                  ...data![printSize],
                  [printColor]: printPriceData,
                },
              })
                .then((message) => {
                  toast.success(message);
                  router.push("/dashboard/print-tariffs");
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardEditPrintPrices.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
