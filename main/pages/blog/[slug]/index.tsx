import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber } from "react-intl";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { Post } from "@/shared/types";
import { getBlogPost } from "@/main/api";
import Layout from "@/main/components/Layout";
import DateIcon from "@/shared/assets/icons/date.svg";
import ViewIcon from "@/shared/assets/icons/view.svg";

export const getServerSideProps: GetServerSideProps<{
  data: Post;
}> = async (context) => {
  try {
    const data = await getBlogPost(context.query.slug as string);
    return { props: { data } };
  } catch {
    return { notFound: true };
  }
};

export default function BlogPost({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const slug = router.query.slug as string;

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
                <FormattedNumber value={data.countOfViews || 0} />
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
