import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { CustomerReport } from "@/shared/types";

interface CustomerReportTableProps {
  customerReports: CustomerReport[];
  onSeeUserOrderList: (userId: string) => void;
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
                <div className={styles.UserName}>
                  {customerReport.user.name}
                </div>
                <div className={styles.UserPhoneNumber}>
                  {customerReport.user.phoneNumber}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ ثبت نام:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={customerReport.registrationDate}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime
                    value={customerReport.registrationDate}
                    hour12
                  />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ اولین سفارش:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={customerReport.firstOrderDate}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={customerReport.firstOrderDate} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ آخرین سفارش:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={customerReport.lastOrderDate}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={customerReport.lastOrderDate} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کل مبلغ پرداختی:</span>
              <FormattedNumber value={customerReport.totalAmountPaid} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>موجودی:</span>
              <div className={styles.UserWallet}>
                <div>
                  <FormattedNumber
                    value={
                      customerReport.user.wallet.balance +
                      customerReport.user.wallet.marketingSales
                    }
                  />{" "}
                  تومان
                </div>
                <div>
                  <div>
                    <span>کیف پول:</span>
                    <span>
                      <FormattedNumber
                        value={customerReport.user.wallet.balance}
                      />{" "}
                      تومان
                    </span>
                  </div>
                  <div>
                    <span>بازاریابی:</span>
                    <span>
                      <FormattedNumber
                        value={customerReport.user.wallet.marketingSales}
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
                onClick={() => onSeeUserOrderList(customerReport.user.id)}
              >
                مشاهده
                <span className={styles.MobileLabel}>سفارش ها</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
