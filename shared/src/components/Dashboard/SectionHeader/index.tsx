import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "@chap-room/shared/assets/images/logo.svg";

interface SectionHeaderProps {
  title: string;
  description?: string;
  hideBackToSiteButton?: boolean;
}

export default function SectionHeader({
  title,
  description,
  hideBackToSiteButton = false,
}: SectionHeaderProps) {
  return (
    <div className={styles.SectionHeader}>
      <div className={styles.TitleContainer}>
        <p className={styles.Title}>{title}</p>
        {!hideBackToSiteButton && (
          <Link to="/" className={styles.BackToSiteButton}>
            بازگشت به سایت
            <Logo width={24} height={24} />
          </Link>
        )}
      </div>
      {description && <p className={styles.Description}>{description}</p>}
    </div>
  );
}
