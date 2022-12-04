import "@/shared/polyfills";
import "./_app.scss";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import { Toaster } from "react-hot-toast";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { LastPageProvider } from "@/shared/context/lastPage";
import PageLoadingIndicator from "@/shared/components/PageLoadingIndicator";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => setIsBrowser(true), []);

  return (
    <IntlProvider locale="fa">
      <LastPageProvider>
        {getLayout(<Component {...pageProps} />)}
      </LastPageProvider>
      <PageLoadingIndicator />
      {isBrowser && <Toaster position="bottom-center" />}
    </IntlProvider>
  );
}
