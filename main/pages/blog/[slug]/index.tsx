import styles from "./style.module.scss";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Post } from "@/shared/types";
import { getBlogPost } from "@/main/api";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate } from "@/shared/components/Formatted";
import Layout from "@/main/components/Layout";
import DateIcon from "@/shared/assets/icons/date.svg";
import ViewIcon from "@/shared/assets/icons/view.svg";

interface PageProps {
  data: Post;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    return { props: { data: await getBlogPost(context.query.slug as string) } };
  } catch {
    return { notFound: true };
  }
};

export default function BlogPost({ data }: PageProps) {
  return (
    <Layout>
      <Head>
        <title>{data.pageTitle} - وبلاگ</title>
        <meta name="description" content={data.metaDescription} />
        <meta name="keywords" content={data.keywords} />
      </Head>
      <div className={styles.Container}>
        <div className={styles.Post}>
          <div className={styles.PostThumbnail}>
            {data.thumbnailUrl && (
              <img src={data.thumbnailUrl} alt={data.thumbnailAlt || ""} />
            )}
          </div>
          <div className={styles.PostHeader}>
            <div className={styles.PostMetaData}>
              <div>
                <DateIcon />
                <FormattedDate value={new Date(new Date(data.updatedAt))} />
              </div>
              <div>
                <ViewIcon />
                {formatNumber(data.countOfViews || 0)}
              </div>
            </div>
            <h1 className={styles.PostTitle}>{data.title}</h1>
          </div>
          <div
            className={styles.PostContent}
            dangerouslySetInnerHTML={{ __html: data.body || "" }}
          />
        </div>
      </div>
    </Layout>
  );
}
