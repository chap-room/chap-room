import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import { UserDataProvider } from "@/main/context/userData";
import Header from "@/main/components/Header";
import Footer from "@/main/components/Footer";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <UserDataProvider>
      <div className={styles.Container}>
        <Header />
        <div className={styles.Content}>{children}</div>
        <Footer />
      </div>
    </UserDataProvider>
  );
}
