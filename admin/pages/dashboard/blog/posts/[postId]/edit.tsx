import { ReactElement, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Post } from "@/shared/types";
import { getBlogPost, updateBlogPost } from "@/admin/api";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import PostForm from "@/admin/components/PostForm";

export default function DashboardEditPost() {
  const router = useRouter();
  const postId = parseInt(router.query.postId as string);

  const [data, setData] = useState<Post>();

  return (
    <>
      <Head>
        <title>داشبورد - ویرایش بلاگ</title>
      </Head>
      <AdminSectionHeader
        title="وبلاگ"
        description="ــ بلاگ ها را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="ویرایش کردن بلاگ"
          end={
            <Link
              href={
                typeof router.query.from === "string"
                  ? router.query.from
                  : "/dashboard/blog"
              }
            >
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={
            typeof router.query.from === "string"
              ? router.query.from
              : "/dashboard/blog"
          }
          title="ویرایش کردن بلاگ"
        />
        <DataLoader
          load={() => {
            if (router.isReady) return getBlogPost(postId);
          }}
          deps={[router.isReady]}
          setData={setData}
        >
          <PostForm
            defaultValues={data}
            onSave={(postFormData) =>
              updateBlogPost(postId, postFormData)
                .then((message) => {
                  toast.success(message);
                  router.push(
                    typeof router.query.from === "string"
                      ? router.query.from
                      : "/dashboard/blog"
                  );
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardEditPost.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
