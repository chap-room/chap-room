import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { DedicatedLinkReport } from "@/shared/types";
import { englishToPersianNumbers } from "@/shared/utils/numbers";

interface DedicatedLinkReportTableProps {
  dedicatedLinkReports: DedicatedLinkReport[];
}

export default function DedicatedLinkReportTable({
  dedicatedLinkReports,
}: DedicatedLinkReportTableProps) {
  return (
    <table className={styles.DedicatedLinkReportTable}>
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>خریدار</th>
          <th>شماره سفارش</th>
          <th>مبلغ سفارش</th>
          <th>پورسانت کاربر</th>
          <th>لینک کاربر</th>
        </tr>
      </thead>
      <tbody>
        {dedicatedLinkReports.map((dedicatedLinkReport) => (
          <tr key={dedicatedLinkReport.orderId}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={new Date(dedicatedLinkReport.createdAt)}
                  />
                </span>
                <span>
                  <FormattedTime
                    value={new Date(dedicatedLinkReport.createdAt)}
                    timeStyle="medium"
                  />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.user.name}
                </div>
                <div>
                  {englishToPersianNumbers(
                    dedicatedLinkReport.user.phoneNumber
                  )}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>خریدار:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.buyer.name}
                </div>
                <div>
                  {englishToPersianNumbers(
                    dedicatedLinkReport.buyer.phoneNumber
                  )}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              {englishToPersianNumbers(dedicatedLinkReport.orderId)}
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              <FormattedNumber value={dedicatedLinkReport.amount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>پورسانت کاربر:</span>
              <span className={styles.Commission}>
                <span>
                  <FormattedNumber
                    value={dedicatedLinkReport.referralBenefit}
                  />{" "}
                  تومان
                </span>
                <span>
                  {"("}
                  <FormattedNumber
                    value={dedicatedLinkReport.referralCommission / 100}
                    style="percent"
                  />
                  {")"}
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>لینک کاربر:</span>
              <span className={styles.Link}>
                {dedicatedLinkReport.referralSlug}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
