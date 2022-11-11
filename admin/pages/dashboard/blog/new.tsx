import { ReactElement, useContext } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Link from "next/link";
// import { DataContext } from "@/admin/context/Data";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DiscountForm from "@/admin/components/DiscountForm";
import PostForm from "@/admin/components/PostForm";

export default function DashboardNewPost() {
  // const data = useContext(DataContext);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>داشبورد - ایجاد نوشته</title>
      </Head>
      <SectionHeader
        title="وبلاگ"
        description="وبلاگ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ایجاد بلاگ جدید"
          end={
            <Link href="/dashboard/blog">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/blog"
          title="ایجاد بلاگ جدید"
        />
        <PostForm
          onSave={(postFormData) => {
            router.push("/dashboard/blog");
          }}
        />
      </SectionContent>
    </>
  );
}

DashboardNewPost.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
