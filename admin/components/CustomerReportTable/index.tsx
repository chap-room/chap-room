import styles from "./style.module.scss";
import { CustomerReport } from "@/shared/types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { englishToPersianNumbers } from "@/shared/utils/numbers";

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
                <div>{englishToPersianNumbers(customerReport.phoneNumber)}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ ثبت نام:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={new Date(customerReport.createdAt)} />
                </span>
                <span>
                  <FormattedTime
                    value={new Date(customerReport.createdAt)}
                    timeStyle="medium"
                  />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ اولین سفارش:</span>
              {customerReport.firstOrderAt ? (
                <span className={styles.Date}>
                  <span>
                    <FormattedDate
                      value={new Date(customerReport.firstOrderAt)}
                    />
                  </span>
                  <span>
                    <FormattedTime
                      value={new Date(customerReport.firstOrderAt)}
                      timeStyle="medium"
                    />
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
                    <FormattedDate
                      value={new Date(customerReport.lastOrderAt)}
                    />
                  </span>
                  <span>
                    <FormattedTime
                      value={new Date(customerReport.lastOrderAt)}
                      timeStyle="medium"
                    />
                  </span>
                </span>
              ) : (
                "ندارد"
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>کل مبلغ پرداختی:</span>
              <FormattedNumber value={customerReport.totalPaidAmount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>موجودی:</span>
              <div className={styles.UserWallet}>
                <div>
                  <FormattedNumber
                    value={
                      customerReport.walletBalance +
                      customerReport.marketingBalance
                    }
                  />{" "}
                  تومان
                </div>
                <div>
                  <div>
                    <span>کیف پول:</span>
                    <span>
                      <FormattedNumber value={customerReport.walletBalance} />{" "}
                      تومان
                    </span>
                  </div>
                  <div>
                    <span>بازاریابی:</span>
                    <span>
                      <FormattedNumber
                        value={customerReport.marketingBalance}
                      />{" "}
                      تومان
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td>
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
