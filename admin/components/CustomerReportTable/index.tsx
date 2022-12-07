import styles from "./style.module.scss";
import { CustomerReport } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface CustomerReportTableProps {
  customerReports: CustomerReport[];
  onSeeUserOrderList: (userId: number) => void;
}

export default function CustomerReportTable({
  customerReports,
  onSeeUserOrderList,
}: CustomerReportTableProps) {
  return (
    <table className={styles.CustomerReportTable}>
      <thead>
        <tr>
          <th>کاربر</th>
          <th>تاریخ ثبت نام</th>
          <th>تاریخ اولین سفارش</th>
          <th>تاریخ آخرین سفارش</th>
          <th>کل مبلغ پرداختی</th>
          <th>موجودی</th>
          <th>سفارش ها</th>
        </tr>
      </thead>
      <tbody>
        {customerReports.map((customerReport) => (
          <tr key={customerReport.id}>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>{customerReport.name}</div>
                <div>{customerReport.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ ثبت نام:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={customerReport.createdAt} />
                </span>
                <span>
                  <FormattedTime value={customerReport.createdAt} />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ اولین سفارش:</span>
              {customerReport.firstOrderAt ? (
                <span className={styles.Date}>
                  <span>
                    <FormattedDate value={customerReport.firstOrderAt} />
                  </span>
                  <span>
                    <FormattedTime value={customerReport.firstOrderAt} />
                  </span>
                </span>
              ) : (
                "ندارد"
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ آخرین سفارش:</span>
              {customerReport.lastOrderAt ? (
                <span className={styles.Date}>
                  <span>
                    <FormattedDate value={customerReport.lastOrderAt} />
                  </span>
                  <span>
                    <FormattedTime value={customerReport.lastOrderAt} />
                  </span>
                </span>
              ) : (
                "ندارد"
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>کل مبلغ پرداختی:</span>
              {formatNumber(customerReport.totalPaidAmount)} تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>موجودی:</span>
              <div className={styles.UserWallet}>
                <div>
                  {formatNumber(
                    customerReport.walletBalance +
                      customerReport.marketingBalance
                  )}{" "}
                  تومان
                </div>
                <div>
                  <div>
                    <span>کیف پول:</span>
                    <span>
                      {formatNumber(customerReport.walletBalance)}{" "}
                      تومان
                    </span>
                  </div>
                  <div>
                    <span>بازاریابی:</span>
                    <span>
                      {formatNumber(customerReport.marketingBalance)}{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div className={styles.SeeUserOrdersButtonContainer}>
                <div />
                <button
                  className={styles.SeeUserOrdersButton}
                  onClick={() => onSeeUserOrderList(customerReport.id)}
                >
                  مشاهده
                  <span className={styles.MobileLabel}>سفارش ها</span>
                </button>
                <div className={styles.CountOfOrders}>
                  {customerReport.countOfOrders}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
