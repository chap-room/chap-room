import { ReactElement, useContext } from "react";
import { useRouter } from "next/router";
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

export default function DashboardEditPost() {
  // const data = useContext(DataContext);
  const router = useRouter();

  const { slug } = router.query;
  // const post = data.state.posts.filter(
  //   (item) => item.slug === slug
  // )[0];

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش کد تخفیف</title>
      </Head>
      <SectionHeader
        title="وبلاگ"
        description="وبلاگ را از این بخش مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن کد تخفیف"
          end={
            <Link href="/dashboard/discounts">
              <Button style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo="/dashboard/discounts"
          title="ویرایش کردن کد تخفیف"
        />
      </SectionContent>
    </>
  );
}

DashboardEditPost.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
