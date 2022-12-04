import { useRouter } from "next/router";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

export interface LastPageData {
  lastPage: string | undefined;
}

const LastPageContext = createContext<LastPageData>({
  lastPage: undefined,
});

export function LastPageProvider({ children }: PropsWithChildren<{}>) {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(router.asPath);
  const [lastPage, setlastPage] = useState<string>();

  useEffect(() => {
    setCurrentPage(router.asPath);
    setlastPage(currentPage);
  }, [router.asPath]);

  return (
    <LastPageContext.Provider value={{ lastPage }}>
      {children}
    </LastPageContext.Provider>
  );
}

export function useLastPage(defaultPage: string) {
  const lastPage = useContext(LastPageContext).lastPage;
  return lastPage || defaultPage;
}
