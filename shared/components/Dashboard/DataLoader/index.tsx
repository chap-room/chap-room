import styles from "./style.module.scss";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";
import { PropsWithChildren, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DataLoaderProps<DT> {
  load: () => Promise<DT> | void;
  setData: (data: DT) => void;
  deps?: unknown[];
}

export default function DataLoader<DT>({
  load,
  setData,
  deps = [],
  children,
}: PropsWithChildren<DataLoaderProps<DT>>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  function fetchData() {
    const funcReturn = load();
    if (funcReturn) {
      setIsLoading(true);
      setIsError(false);
      funcReturn
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
  }

  useEffect(fetchData, deps);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className={styles.Error}>
        <h1>خطا</h1>
        <p>
          مشکل موقتی در اتصال شبکه شما وجود دارد. لطفاً مطمئن شوید که به اینترنت
          متصل هستید و سپس دوباره امتحان کنید.
        </p>
        <Button varient="filled" onClick={fetchData}>
          سعی مجدد
        </Button>
      </div>
    );

  return <>{children}</>;
}
