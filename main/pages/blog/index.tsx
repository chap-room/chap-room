import styles from "./style.module.scss";
import { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/main/components/Layout";

export default function Blog() {
  return (
    <Head>
      <title>وبلاگ</title>
    </Head>
  );
}

Blog.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
