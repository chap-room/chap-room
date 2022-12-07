import { ReactElement, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Head from "next/head";
import Link from "next/link";
import { Post } from "@/shared/types";
import { deleteBlogPost, getBlogPosts } from "@/admin/api";
import { formatNumber } from "@/shared/utils/format";
import DashboardLayout from "@/admin/components/Layout";
import AddIcon from "@/shared/assets/icons/add.svg";
import AdminSectionHeader from "@/admin/components/AdminSectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import IconButton from "@/shared/components/IconButton";
import ButtonList from "@/shared/components/ButtonList";
import Button from "@/shared/components/Button";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import PostGrid from "@/admin/components/PostGrid";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardBlog() {
  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    posts: Post[];
  }>({ totalCount: 0, pageSize: 0, posts: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isFirstReady, setIsFirstReady] = useState(true);
  useEffect(() => {
    if (router.isReady) {
      if (isFirstReady) {
        setIsFirstReady(false);
        if (router.query.search) {
          setSearch(router.query.search as string);
        }
        const queryPage = parseInt(router.query.page as string);
        if (!isNaN(queryPage) && queryPage > 1) {
          setPage(queryPage);
        }
      } else {
        const query: Record<string, string> = {};

        if (search) query.search = search;
        if (page > 1) query.page = page.toString();

        router.push(
          {
            pathname: router.pathname,
            query,
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [router.isReady, search, page]);

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    number | null
  >(null);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Head>
        <title>داشبورد - وبلاگ</title>
      </Head>
      <AdminSectionHeader
        title="وبلاگ"
        description="ــ بلاگ ها را از این قسمت مدیریت کنید"
      />
      <SectionContent>
        <ContentHeader
          title="همه بلاگ ها"
          subTitle={
            data.totalCount ? `(${formatNumber(data.totalCount)})` : undefined
          }
          end={
            <ButtonList gap={15}>
              <Link href="/dashboard/blog/categories">
                <Button
                  varient="content-title-outlined"
                  style={{ minWidth: 170 }}
                >
                  مدیریت دسته بندی ها
                </Button>
              </Link>
              <Link href="/dashboard/blog/posts/new">
                <Button varient="content-title-none">
                  ایجاد بلاگ
                  <FilledIconContainer style={{ marginRight: 10 }}>
                    <AddIcon />
                  </FilledIconContainer>
                </Button>
              </Link>
            </ButtonList>
          }
        />
        <MobileContentHeader
          backTo="/dashboard"
          title="همه وبلاگ ها"
          end={
            <Link href="/dashboard/blog/posts/new">
              <IconButton varient="filled">
                <AddIcon />
              </IconButton>
            </Link>
          }
        />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "جستجو بلاگ با عنوان" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() => getBlogPosts(search, page)}
          deps={[search, page]}
          setData={setData}
          reloadRef={reloadRef}
        >
          <PostGrid
            posts={data.posts}
            onDeletePost={setPendingDeleteRequest}
            onEditPost={(postId) =>
              router.push(
                `/dashboard/blog/posts/${postId}/edit?from=${encodeURIComponent(
                  router.asPath
                )}`
              )
            }
          />
          {!data.posts.length && <EmptyNote>هیچ بلاگی وجود ندارد</EmptyNote>}
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
              deleteBlogPost(pendingDeleteRequest!)
                .then((message) => {
                  toast.success(message);
                  setPendingDeleteRequest(null);
                  if (reloadRef.current) reloadRef.current();
                })
                .catch(toast.error)
            }
            message="از حذف این بلاگ مطمئن هستید؟"
            confirmButtonText="حذف"
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardBlog.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
