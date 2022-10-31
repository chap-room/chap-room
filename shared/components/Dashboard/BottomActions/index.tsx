import styles from "./style.module.scss";
import { PropsWithChildren } from "react";
import ButtonList from "@/shared/components/ButtonList";

export default function BottomActions({ children }: PropsWithChildren<{}>) {
  return (
    <div className={styles.Actions}>
      <ButtonList>{children}</ButtonList>
    </div>
  );
}
