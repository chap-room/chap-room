import { useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import BindingPricesForm from "@/admin/components/BindingPricesForm";

export default function DashboardBindingPrices() {
  const data = useContext(DataContext);
  const router = useRouter();

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - تعرفه های صحافی</title>
      </Head>
      <SectionHeader
        title="تعرفه ها"
        description="تعرفه های چاپ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="صحافی"
          end={
            <Link href="/dashboard/print-prices">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader backTo="/dashboard/print-prices" title="صحافی" />
        <BindingPricesForm
          defaultValues={data.state.allPrintPrices.binding}
          onSave={(bindingPricesFormData) => {
            data.dispatch({
              type: "ALL_PRINT_PRICES:UPDATE",
              payload: {
                ...data.state.allPrintPrices,
                binding: bindingPricesFormData,
              },
            });
            router.push("/dashboard/print-prices");
          }}
        />
      </SectionContent>
    </DashboardLayout>
  );
}
