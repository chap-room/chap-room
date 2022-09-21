import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { PropsWithChildren } from "react";

interface SectionProps {
  title: string;
  description?: string;
}

export default function Section({
  title,
  description,
  children,
}: PropsWithChildren<SectionProps>) {
  return (
    <div className={styles.Container}>
      <div className={styles.TitleContainer}>
        <p className={styles.Title}>{title}</p>
        <Link to="/" className={styles.BackToSiteButton}>
          بازگشت به سایت
          <Logo width={24} height={24} />
        </Link>
      </div>
      {description && <p className={styles.Description}>{description}</p>}
      <div className={styles.ContentContainer}>{children}</div>
    </div>
  );
}
