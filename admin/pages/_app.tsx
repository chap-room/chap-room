import "@/shared/polyfills";
import "./_app.scss";
import type { AppProps } from "next/app";
import { IntlProvider } from "react-intl";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <IntlProvider locale="fa">
      <div id="root">
        <Component {...pageProps} />
      </div>
    </IntlProvider>
  );
}
