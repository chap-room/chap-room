import styles from "./style.module.scss";
import { ReactElement, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { PostCategory } from "@/shared/types";
import {
  deleteBlogCategory,
  getBlogCategories,
  newBlogCategory,
} from "@/admin/api";
import { useLastPage } from "@/shared/context/lastPage";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import DashboardLayout from "@/admin/components/Layout";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import TextInput from "@/shared/components/TextInput";
import SmallLoader from "@/shared/components/SmallLoader";
import DataLoader from "@/shared/components/DataLoader";
import PostCategoryTable from "@/admin/components/PostCategoryTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardBlogCategories() {
  const intl = useIntl();
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    categories: PostCategory[];
  }>({ totalCount: 0, pageSize: 0, categories: [] });

  const [page, setPage] = useState(1);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        if (page > 1) {
          router.query.page = page.toString();
        } else {
          delete router.query.page;
        }

        router.push(router);
      }
    }
  }, [router.isReady, page]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmittingnewCategory, setIsSubmittingnewCategory] = useState(false);
  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    number | null
  >(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - مدیریت دسته بندی بلاگ ها</title>
      </Head>
      <AdminSectionHeader
        title="وبلاگ"
        description="ــ بلاگ ها را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="مدیریت دسته بندی بلاگ ها"
          subTitle={
            data.totalCount
              ? `(${intl.formatNumber(data.totalCount)})`
              : undefined
          }
          end={
            <Link href={useLastPage("/dashboard/blog")}>
              <Button varient="none" style={{ padding: 0 }}>
                بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          }
        />
        <MobileContentHeader
          backTo={useLastPage("/dashboard/blog")}
          title="مدیریت دسته بندی بلاگ ها"
        />
        <Controls
          start={
            <div className={styles.NewCategory}>
              <TextInput
                inputProps={{ placeholder: "نام دسته بندی جدید" }}
                value={newCategoryName}
                onChange={setNewCategoryName}
              />
              {!isSubmittingnewCategory ? (
                <button
                  disabled={isSubmittingnewCategory || !newCategoryName}
                  onClick={() => {
                    setIsSubmittingnewCategory(true);
                    newBlogCategory({ name: newCategoryName })
                      .then((message) => {
                        toast.success(message);
                        setNewCategoryName("");
                        if (reloadRef.current) reloadRef.current();
                      })
                      .catch(toast.error)
                      .finally(() => setIsSubmittingnewCategory(false));
                  }}
                >
                  افزودن
                </button>
              ) : (
                <SmallLoader />
              )}
            </div>
          }
        />
        <DataLoader
          load={() => getBlogCategories(page)}
          deps={[page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <PostCategoryTable
            categories={data.categories}
            onDeletePostCategory={setPendingDeleteRequest}
            startCountFrom={(page - 1) * data.pageSize + 1}
          />
          {!data.categories.length && (
            <EmptyNote>هیچ دسته بندی وجود ندارد</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
          <WarningConfirmDialog
            open={pendingDeleteRequest !== null}
            onClose={() => {
              setPendingDeleteRequest(null);
            }}
            onConfirm={() =>
              deleteBlogCategory(pendingDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="از حذف این دسته بندی مطمئن هستید؟"
            confirmButtonText="حذف"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardBlogCategories.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
