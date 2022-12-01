import styles from "./style.module.scss";
import { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/shared/assets/images/logo.svg";

interface SectionHeaderProps {
  titleStart?: ReactNode;
  title: string;
  titleCenter?: ReactNode;
  titleEnd?: ReactNode;
  description?: string;
  isAdmin?: boolean;
}

export default function SectionHeader({
  titleStart,
  title,
  titleCenter,
  titleEnd,
  description,
  isAdmin = false,
}: SectionHeaderProps) {
  return (
    <div className={styles.SectionHeader}>
      <div className={styles.TitleContainer}>
        <div className={styles.TitleStart}>
          {titleStart}
          <p className={styles.Title}>{title}</p>
        </div>
        <div className={styles.TitleCenter}>{titleCenter}</div>
        <div className={styles.TitleEnd}>
          {titleEnd}
          {!isAdmin ? (
            <Link href="/">
              <a className={styles.BackToSiteButton}>
                بازگشت به سایت
                <Logo width={24} height={24} />
              </a>
            </Link>
          ) : (
            <a
              className={styles.BackToSiteButton}
              href={process.env.MAIN_URL}
              target="_blank"
            >
              بازگشت به سایت
              <Logo width={24} height={24} />
            </a>
          )}
        </div>
      </div>
      {description && <p className={styles.Description}>{description}</p>}
    </div>
  );
}
