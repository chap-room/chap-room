import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { BookTariffs } from "@/shared/types";
import { getBookTariffs } from "@/admin/api";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import DataLoader from "@/shared/components/DataLoader";
import BookTariffsTable from "@/admin/components/BookTariffsTable";

export default function DashboardBookPricesList() {
  const router = useRouter();

  const [data, setData] = useState<BookTariffs>();

  return (
    <>
      <Head>
        <title>داشبورد - تعرفه های کتاب</title>
      </Head>
      <AdminSectionHeader
        title="تعرفه های کتاب"
        description="ــ تعرفه های کتاب را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader title="لیست تعرفه ها" />
        <MobileContentHeader backTo="/dashboard" title="لیست تعرفه ها" />
        <DataLoader load={() => getBookTariffs()} setData={setData}>
          <BookTariffsTable
            bookTariffs={data!}
            onEditBookPrices={(size, paperType, bindingType) =>
              router.push(
                `/dashboard/book-tariffs/${size}/${
                  {
                    writing80Grams: "writing-80-grams",
                  }[paperType]
                }/${
                  {
                    hotGlue: "hot-glue",
                  }[bindingType]
                }/edit`
              )
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardBookPricesList.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
