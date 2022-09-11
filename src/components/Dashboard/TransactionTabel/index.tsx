import { Transaction, TransactionStatus } from "../../../types";
import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";

interface TransactionTabelProps {
  transactions: Transaction[];
  onSeeDetails: (transactionId: string) => void;
}

export default function TransactionTabel({
  transactions,
  onSeeDetails,
}: TransactionTabelProps) {
  return (
    <table className={styles.TransactionTabel}>
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
              <span className={styles.Date}>
                <FormattedDate value={transaction.data} dateStyle="medium" />
                <br />
                <FormattedTime value={transaction.data} hour12 />
              </span> 
            </td>
            <td>
              <FormattedNumber value={transaction.amount} /> تومان
            </td>
            <td>{transaction.details}</td>
            <td>
              {transaction.status === TransactionStatus.successful ? (
                <span className={styles.Successful}>{transaction.status}</span>
              ) : (
                <span className={styles.Unsuccessful}>{transaction.status}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
