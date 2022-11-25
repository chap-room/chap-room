import { ReactNode } from "react";
import styles from "./style.module.scss";

interface ContentHeaderProps {
  title: ReactNode;
  subTitle?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
}

export default function ContentHeader({
  title,
  subTitle,
  start,
  end,
}: ContentHeaderProps) {
  return (
    <div className={styles.ContentHeader}>
      {start}
      <div className={styles.TitleContainer}>
        <div className={styles.Title}>{title}</div>
        {subTitle && <div className={styles.SubTitle}>{subTitle}</div>}
      </div>
      {end}
    </div>
  );
}
