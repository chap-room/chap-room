import styles from "./style.module.scss";
import { PropsWithChildren } from "react";

interface BottomActionsProps {
  gap?: number;
}

export default function ButtonList({ children, gap }: PropsWithChildren<BottomActionsProps>) {
  return (
    <div className={styles.ButtonList} style={{ gap }}>
      {children}
    </div>
  );
}
