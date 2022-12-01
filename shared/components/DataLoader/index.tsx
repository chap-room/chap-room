import styles from "./style.module.scss";
import {
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader";
import SmallLoader from "@/shared/components/SmallLoader";

interface UseDataLoaderProps<DT> {
  load: () => Promise<DT> | [Promise<DT>, AbortController] | void;
  setData: (data: DT) => void;
  deps?: unknown[];
  initialFetch?: boolean;
}

export interface DataLoaderState {
  isLoading: boolean;
  isError: boolean;
  reload: () => void;
}

export function useDataLoader<DT>({
  load,
  setData,
  deps = [],
  initialFetch = true,
}: UseDataLoaderProps<DT>): DataLoaderState {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isFirstTry, setIsFirstTry] = useState(true);
  const [isLoading, setIsLoading] = useState(initialFetch);
  const [isError, setIsError] = useState(false);

  const fetchData = () => {
    if (isFirstRender) {
      setIsFirstRender(false);
      if (!initialFetch) return;
    }
    if (isLoading && !isFirstTry) return;

    const funcReturn = load();
    if (funcReturn) {
      setIsLoading(true);
      setIsError(false);
      if (isFirstTry) setIsFirstTry(false);
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
  };

  useEffect(fetchData, deps);

  return { isLoading, isError, reload: fetchData };
}

interface DataLoaderViewProps {
  state: DataLoaderState;
  size?: "small" | "larg";
}

export function DataLoaderView({
  state: { isLoading, isError, reload },
  size,
  children,
}: PropsWithChildren<DataLoaderViewProps>) {
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
        <Button varient="filled" onClick={reload}>
          سعی مجدد
        </Button>
      </div>
    );

  return <>{children}</>;
}

interface DataLoaderProps<DT> {
  load: () => Promise<DT> | [Promise<DT>, AbortController] | void;
  setData: (data: DT) => void;
  deps?: unknown[];
  initialFetch?: boolean;
  size?: "small" | "larg";
  reloadRef?: MutableRefObject<(() => void) | null>;
}

export default function DataLoader<DT>({
  load,
  setData,
  deps = [],
  initialFetch = true,
  size = "larg",
  reloadRef,
  children,
}: PropsWithChildren<DataLoaderProps<DT>>) {
  const state = useDataLoader({
    load,
    setData,
    deps,
    initialFetch,
  });

  if (reloadRef) reloadRef.current = state.reload;

  return (
    <DataLoaderView state={state} size={size}>
      {children}
    </DataLoaderView>
  );
}
