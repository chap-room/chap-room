import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ReactComponent as Logo } from "../../../../assets/images/logo.svg";
import { DataContext } from "../../../../context/data";
import PrintPrices from "../../../../components/PrintPrices";

export default function DashboardIndex() {
  const data = useContext(DataContext);

  return (
    <div className={styles.Container}>
      <div className={styles.TitleContainer}>
        <p className={styles.Title}>داشبورد</p>
        <div className={styles.Spacer} />
        <Link to="/" className={styles.BackToSiteButton}>
          بازگشت به سایت
          <Logo width={24} height={24} />
        </Link>
      </div>
      <div className={styles.ContentContainer}>
        <div>
          <div>
            <div className={styles.WelcomeUser}>
              سلام {data.state.currentUser.name}
            </div>
            <div className={styles.DashboardDescription}>
              خلاصه‌ای از همه چیز را ببینید
            </div>
          </div>
          <div>
            <PrintPrices />
          </div>
        </div>
        <div>asd</div>
      </div>
    </div>
  );
}
