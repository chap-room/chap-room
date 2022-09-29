import styles from "./style.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as ArrowForwardIcon } from "@chap-room/shared/assets/icons/arrowForward.svg";

interface MobileContentHeaderProps {
  backTo?: string;
  start?: ReactNode;
  title: string;
  end?: ReactNode;
}

export default function MobileContentHeader({
  backTo,
  start,
  title,
  end,
}: MobileContentHeaderProps) {
  return (
    <div className={styles.MobileContentHeader}>
      {start}
      {backTo && (
        <Link to={backTo} className={styles.BackButton}>
          <ArrowForwardIcon />
        </Link>
      )}
      <div className={styles.Title}>{title}</div>
      {end}
    </div>
  );
}
