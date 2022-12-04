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
  const [pages, setPages] = useState([
    { pathname: router.pathname, asPath: router.asPath },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const newIndex =
      pages[currentPageIndex - 1]?.asPath === router.asPath
        ? currentPageIndex - 1
        : router.pathname === pages[currentPageIndex].pathname
        ? currentPageIndex
        : currentPageIndex + 1;
    setCurrentPageIndex(newIndex);
    const newPages = [...pages];
    newPages[newIndex] = { pathname: router.pathname, asPath: router.asPath };
    setPages(newPages);
  }, [router.asPath]);

  return (
    <LastPageContext.Provider
      value={{ lastPage: pages[currentPageIndex - 1]?.asPath }}
    >
      {children}
    </LastPageContext.Provider>
  );
}

export function useLastPage(defaultPage: string) {
  const lastPage = useContext(LastPageContext).lastPage;
  return lastPage || defaultPage;
}
