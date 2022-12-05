import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/shared/components/Loader";

export default function PageLoadingIndicator() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = (
      _url: string,
      {
        shallow,
      }: {
        shallow: boolean;
      }
    ) => {
      if (!shallow) setLoading(true);
    };
    const complete = (
      _url: string,
      {
        shallow,
      }: {
        shallow: boolean;
      }
    ) => {
      if (!shallow) setLoading(false);
    };
    const error = (
      _error: any,
      _url: string,
      {
        shallow,
      }: {
        shallow: boolean;
      }
    ) => {
      if (!shallow) setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", complete);
    router.events.on("routeChangeError", error);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", complete);
      router.events.off("routeChangeError", error);
    };
  }, []);

  return (
    <>
      {loading && (
        <div className={styles.Container}>
          <Loader />
        </div>
      )}
    </>
  );
}
