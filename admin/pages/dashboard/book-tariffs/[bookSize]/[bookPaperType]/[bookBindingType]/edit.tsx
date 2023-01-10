import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { BookTariffs } from "@/shared/types";
import { getBookTariffs, updateBookTariffs } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import BookPriceForm from "@/admin/components/BookPriceForm";

export default function DashboardEditBookPrice() {
  const router = useRouter();
  const bookSize = router.query.bookSize as "rahli" | "raqai" | "vaziri";
  const bookPaperType = {
    "writing-80-grams": "writing80Grams" as const,
  }[router.query.bookPaperType as string];
  const bookBindingType = {
    "hot-glue": "hotGlue" as const,
  }[router.query.bookBindingType as string];

  if (
    !["rahli", "raqai", "vaziri"].includes(bookSize) ||
    !bookPaperType ||
    !bookBindingType
  ) {
    /* TODO 404 */
    return <></>;
  }

  const [data, setData] = useState<BookTariffs>();

  const price = data
    ? data[bookSize][bookPaperType][bookBindingType]
    : undefined;

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش تعرفه ها</title>
      </Head>
      <AdminSectionHeader
        title="تعرفه های کتاب"
        description="ــ تعرفه های کتاب را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن تعرفه ها"
          end={
            <Link href="/dashboard/book-tariffs">
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/book-tariffs"
          title="ویرایش کردن تعرفه ها"
        />
        <DataLoader load={() => getBookTariffs()} setData={setData}>
          <BookPriceForm
            bookSize={bookSize}
            bookPaperType={bookPaperType}
            bookBindingType={bookBindingType}
            defaultValue={price!}
            onSave={(price) =>
              updateBookTariffs({
                ...data!,
                [bookSize]: {
                  ...data![bookSize],
                  [bookPaperType]: {
                    ...data![bookSize][bookPaperType],
                    [bookBindingType]: price,
                  },
                },
              })
                .then((message) => {
                  toast.success(message);
                  router.push("/dashboard/book-tariffs");
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardEditBookPrice.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
