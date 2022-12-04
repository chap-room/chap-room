import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/shared/components/Loader";

export default function PageLoadingIndicator() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const start = (url: string) => {
      if (url.split("?")[0] !== router.pathname) setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
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
