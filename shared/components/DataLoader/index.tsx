import styles from "./style.module.scss";
import { PropsWithChildren, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";
import SmallLoader from "@/shared/components/SmallLoader";

interface DataLoaderProps<DT> {
  load: () => Promise<DT> | [Promise<DT>, AbortController] | void;
  setData: (data: DT) => void;
  deps?: unknown[];
  size?: "small" | "larg";
}

export default function DataLoader<DT>({
  load,
  setData,
  deps = [],
  size = "larg",
  children,
}: PropsWithChildren<DataLoaderProps<DT>>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  function fetchData() {
    const funcReturn = load();
    if (funcReturn) {
      setIsLoading(true);
      setIsError(false);
      (Array.isArray(funcReturn) ? funcReturn[0] : funcReturn)
        .then((data: DT) => {
          setData(data);
        })
        .catch((message) => {
          toast.error(message);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      if (Array.isArray(funcReturn)) {
        funcReturn[1].abort();
      }
    };
  }

  useEffect(fetchData, deps);

  if (isLoading) return size === "small" ? <SmallLoader /> : <Loader />;

  if (isError)
    return (
      <div className={styles.Error}>
        {size !== "small" && <h1>خطا</h1>}
        {size !== "small" && (
          <p>
            مشکل موقتی در اتصال شبکه شما وجود دارد. لطفاً مطمئن شوید که به
            اینترنت متصل هستید و سپس دوباره امتحان کنید.
          </p>
        )}
        <Button varient="filled" onClick={fetchData}>
          سعی مجدد
        </Button>
      </div>
    );

  return <>{children}</>;
}
