import styles from "./style.module.scss";
import { ReactNode } from "react";
import Link from "next/link";
import ArrowForwardIcon from "@/shared/assets/icons/arrowForward.svg";

interface MobileContentHeaderProps {
  backTo?: string;
  onBack?: () => void;
  start?: ReactNode;
  title: string;
  end?: ReactNode;
}

export default function MobileContentHeader({
  backTo,
  onBack,
  start,
  title,
  end,
}: MobileContentHeaderProps) {
  return (
    <div className={styles.MobileContentHeader}>
      {start}
      {onBack ? (
        <a className={styles.BackButton} onClick={onBack}>
          <ArrowForwardIcon />
        </a>
      ) : backTo ? (
        <Link href={backTo}>
          <a className={styles.BackButton}>
            <ArrowForwardIcon />
          </a>
        </Link>
      ) : undefined}
      <div className={styles.Title}>{title}</div>
      {end}
    </div>
  );
}
