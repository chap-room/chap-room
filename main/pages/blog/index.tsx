import styles from "./style.module.scss";
import { ReactElement, useState } from "react";
import { FormattedDate, FormattedNumber } from "react-intl";
import Head from "next/head";
import Layout from "@/main/components/Layout";
import DateIcon from "@/shared/assets/icons/date.svg";
import ViewIcon from "@/shared/assets/icons/view.svg";
import Radio from "@/shared/components/Radio";
import Button from "@/shared/components/Button";
import DataLoader from "@/shared/components/DataLoader";
import {
  getBlogCategories,
  getBlogPosts,
  getBlogPostsByCategory,
} from "@/main/api";
import { Post, PostCategory } from "@/shared/types";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import Link from "next/link";

export default function Blog() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    posts: Post[];
  }>({
    totalCount: 0,
    pageSize: 0,
    posts: [],
  });

  const [page, setPage] = useState(1);

  const [categoriesData, setCategoriesData] = useState<{
    totalBlogs: number;
    categories: PostCategory[];
  }>({ totalBlogs: 0, categories: [] });

  const [popularPostData, setPopularPostData] = useState<Post[]>([]);

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
                        <FormattedDate value={post.lastUpdateDate} />
                      </div>
                      <div>
                        <ViewIcon />
                        <FormattedNumber value={post.countOfViews} />
                      </div>
                    </div>
                    <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
                      <Button varient="filled">مشاهده بیشتز</Button>
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
              <DataLoader
                load={() => getBlogCategories()}
                setData={setCategoriesData}
              >
                <div className={styles.CategoryList}>
                  <div
                    onClick={() => {
                      setSelectedCategoryId(null);
                      setPage(1);
                    }}
                  >
                    <Radio checked={selectedCategoryId === null} />
                    <div>همه</div>
                    <div>
                      <FormattedNumber value={categoriesData.totalBlogs} />
                    </div>
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
                      <div>
                        <FormattedNumber value={category.countOfBlogs} />
                      </div>
                    </div>
                  ))}
                </div>
              </DataLoader>
            </div>
            <div className={styles.Widget}>
              <div className={styles.WidgetTitle}>محبوبترین مقالات</div>
              <DataLoader
                load={() => getBlogPosts(1, "popular")}
                setData={(data) => setPopularPostData(data.posts)}
              >
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
                          <FormattedDate value={post.lastUpdateDate} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!popularPostData.length && (
                    <EmptyNote>هیچ بلاگی وجود ندارد</EmptyNote>
                  )}
                </div>
              </DataLoader>
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
