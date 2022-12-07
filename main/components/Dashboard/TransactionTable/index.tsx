import styles from "./style.module.scss";
import { Transaction } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface TransactionTableProps {
  transactions: Transaction[];
  onSeeDetails: (orderId: number) => void;
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
                  <FormattedDate value={transaction.createdAt} />
                </span>
                <span>
                  <FormattedTime value={transaction.createdAt} />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ:</span>
              {formatNumber(transaction.amount)} تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>جزییات:</span>
              {!transaction.orderId ? (
                <span>{transaction.description}</span>
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
              {transaction.status === "successful" ? (
                <span className={styles.Successful}>موفق</span>
              ) : (
                <span className={styles.Unsuccessful}>نا موفق</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
