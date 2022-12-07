import styles from "./style.module.scss";
import { DedicatedLinkReport } from "@/shared/types";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";
import { formatNumber } from "@/shared/utils/format";

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
                  <FormattedDate value={dedicatedLinkReport.createdAt} />
                </span>
                <span>
                  <FormattedTime value={dedicatedLinkReport.createdAt} />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.user.name}
                </div>
                <div>{dedicatedLinkReport.user.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>خریدار:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.buyer.name}
                </div>
                <div>{dedicatedLinkReport.buyer.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              {dedicatedLinkReport.orderId}
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              {formatNumber(dedicatedLinkReport.amount)} تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>پورسانت کاربر:</span>
              <span className={styles.Commission}>
                <span>
                  {formatNumber(dedicatedLinkReport.referralBenefit)} تومان
                </span>
                <span>({dedicatedLinkReport.referralCommission}٪)</span>
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
