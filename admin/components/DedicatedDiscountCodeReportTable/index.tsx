import styles from "./style.module.scss";
import { DedicatedDiscountCodeReport } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface DedicatedDiscountCodeReportTableProps {
  dedicatedDiscountCodeReports: DedicatedDiscountCodeReport[];
}

export default function DedicatedDiscountCodeReportTable({
  dedicatedDiscountCodeReports,
}: DedicatedDiscountCodeReportTableProps) {
  return (
    <table className={styles.DedicatedDiscountCodeReportTable}>
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>خریدار</th>
          <th>شماره سفارش</th>
          <th>مبلغ سفارش</th>
          <th>تخفیف خریدار</th>
          <th>پورسانت کاربر</th>
          <th>کد تخفیف</th>
        </tr>
      </thead>
      <tbody>
        {dedicatedDiscountCodeReports.map((dedicatedDiscountCodeReport) => (
          <tr key={dedicatedDiscountCodeReport.orderId}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={dedicatedDiscountCodeReport.createdAt}
                  />
                </span>
                <span>
                  <FormattedTime
                    value={dedicatedDiscountCodeReport.createdAt}
                  />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedDiscountCodeReport.user.name}
                </div>
                <div>{dedicatedDiscountCodeReport.user.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>خریدار:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedDiscountCodeReport.buyer.name}
                </div>
                <div>{dedicatedDiscountCodeReport.buyer.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              {dedicatedDiscountCodeReport.orderId}
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              {dedicatedDiscountCodeReport.amount} تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>تخفیف خریدار:</span>
              <span className={styles.Commission}>
                <span>
                  {formatNumber(dedicatedDiscountCodeReport.discountAmount)}{" "}
                  تومان
                </span>
                <span>({dedicatedDiscountCodeReport.discountValue}٪ )</span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>پورسانت کاربر:</span>
              <span className={styles.Commission}>
                <span>
                  {formatNumber(dedicatedDiscountCodeReport.discountBenefit)}{" "}
                  تومان
                </span>
                <span>
                  {"("}
                  {dedicatedDiscountCodeReport.discountBenefitPercentage}٪{")"}
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کد تخفیف:</span>
              <span className={styles.DiscountCode}>
                {dedicatedDiscountCodeReport.discountCode}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
