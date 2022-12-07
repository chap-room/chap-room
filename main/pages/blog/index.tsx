import styles from "./style.module.scss";
import { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Post, PostCategory } from "@/shared/types";
import {
  getBlogCategories,
  getBlogPosts,
  getBlogPostsByCategory,
} from "@/main/api";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate } from "@/shared/components/Formatted";
import Layout from "@/main/components/Layout";
import DataLoader from "@/shared/components/DataLoader";
import DateIcon from "@/shared/assets/icons/date.svg";
import ViewIcon from "@/shared/assets/icons/view.svg";
import Radio from "@/shared/components/Radio";
import Button from "@/shared/components/Button";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";

interface PageProps {
  categoryId: number | null;
  page: number;
  data: {
    totalCount: number;
    pageSize: number;
    posts: Post[];
  };
  categoriesData: {
    totalBlogs: number;
    categories: PostCategory[];
  };
  popularPostData: Post[];
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const queryCategoryId = parseInt(context.query.categoryId as string);
  const categoryId = !isNaN(queryCategoryId) ? queryCategoryId : null;
  const queryPage = parseInt(context.query.page as string);
  const page = !isNaN(queryPage) && queryPage > 0 ? queryPage : 1;

  const data = (await (categoryId !== null
    ? getBlogPostsByCategory(categoryId, page)
    : getBlogPosts(page)[0]))!;
  const categoriesData = await getBlogCategories();
  const popularPostData = (await getBlogPosts(1, "popular")[0])!.posts;

  return {
    props: {
      categoryId,
      page,
      data,
      categoriesData,
      popularPostData,
    },
  };
};

export default function Blog(props: PageProps) {
  const router = useRouter();

  const [data, setData] = useState(props.data);
  const { categoriesData, popularPostData } = props;

  const [page, setPage] = useState(props.page);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    props.categoryId
  );

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      const query: Record<string, string> = {};

      if (selectedCategoryId !== null)
        query.categoryId = selectedCategoryId.toString();
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
  }, [selectedCategoryId, page]);

  return (
    <>
      <Head>
        <title>وبلاگ</title>
      </Head>
      <div className={styles.Container}>
        <div className={styles.Content}>
          <DataLoader
            load={() =>
              selectedCategoryId !== null
                ? getBlogPostsByCategory(selectedCategoryId, page)
                : getBlogPosts(page)
            }
            deps={[selectedCategoryId, page]}
            setData={setData}
            initialFetch={false}
          >
            <div className={styles.Posts}>
              {data.posts.map((post) => (
                <div key={post.id} className={styles.Post}>
                  {post.thumbnailUrl && (
                    <div className={styles.PostThumbnail}>
                      <img
                        src={post.thumbnailUrl}
                        alt={post.thumbnailAlt || ""}
                      />
                    </div>
                  )}
                  <div className={styles.PostTitle}>{post.title}</div>
                  <div className={styles.PostContent}>
                    {post.metaDescription}
                  </div>
                  <div className={styles.PostFooter}>
                    <div>
                      <div>
                        <DateIcon />
                        <FormattedDate
                          value={new Date(new Date(post.updatedAt))}
                        />
                      </div>
                      <div>
                        <ViewIcon />
                        {formatNumber(post.countOfViews)}
                      </div>
                    </div>
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
                      <Button varient="filled">مشاهده بیشتر</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {!data.posts.length && <EmptyNote>هیچ بلاگی وجود ندارد</EmptyNote>}
            <Pagination
              currentPage={page}
              totalCount={data.totalCount}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          </DataLoader>
        </div>
        <div>
          <div className={styles.Sidebar}>
            <div className={styles.Widget}>
              <div className={styles.WidgetTitle}>دسته بندی</div>
              <div className={styles.CategoryList}>
                <div
                  onClick={() => {
                    setSelectedCategoryId(null);
                    setPage(1);
                  }}
                >
                  <Radio checked={selectedCategoryId === null} />
                  <div>همه</div>
                  <div>{formatNumber(categoriesData.totalBlogs)}</div>
                </div>
                {categoriesData.categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      setSelectedCategoryId(category.id);
                      setPage(1);
                    }}
                  >
                    <Radio checked={selectedCategoryId === category.id} />
                    <div>{category.name}</div>
                    <div>{formatNumber(category.countOfBlogs)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.Widget}>
              <div className={styles.WidgetTitle}>محبوبترین مقالات</div>
              <div className={styles.PopularPosts}>
                {popularPostData.map((post) => (
                  <div key={post.id}>
                    {post.thumbnailUrl && (
                      <div className={styles.PostThumbnail}>
                        <img
                          src={post.thumbnailUrl}
                          alt={post.thumbnailAlt || ""}
                        />
                      </div>
                    )}
                    <div>
                      <div>{post.title}</div>
                      <div>
                        <FormattedDate
                          value={new Date(new Date(post.updatedAt))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {!popularPostData.length && (
                  <EmptyNote>هیچ بلاگی وجود ندارد</EmptyNote>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
