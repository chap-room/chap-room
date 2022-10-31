import styles from "./style.module.scss";
import { Transaction, TransactionStatus } from "@/shared/types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";

interface TransactionTableProps {
  transactions: Transaction[];
  onSeeDetails: (orderId: string) => void;
}

export default function TransactionTable({
  transactions,
  onSeeDetails,
}: TransactionTableProps) {
  return (
    <table className={styles.TransactionTable}>
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>مبلغ</th>
          <th>جزییات</th>
          <th>وضعیت</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={transaction.date} dateStyle="medium" />
                </span>
                <span>
                  <FormattedTime value={transaction.date} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ:</span>
              <FormattedNumber value={transaction.amount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>جزییات:</span>
              {!transaction.orderId ? (
                <span>{transaction.details}</span>
              ) : (
                <button
                  className={styles.SeeDetailsButton}
                  onClick={() => onSeeDetails(transaction.orderId!)}
                >
                  مشاهده
                </button>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              {transaction.status === TransactionStatus.successful ? (
                <span className={styles.Successful}>{transaction.status}</span>
              ) : (
                <span className={styles.Unsuccessful}>
                  {transaction.status}
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
