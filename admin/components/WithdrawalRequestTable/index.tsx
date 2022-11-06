import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { WithdrawalRequest, WithdrawalRequestStatus } from "@/shared/types";

interface WithdrawalRequestTableProps {
  withdrawalRequests: WithdrawalRequest[];
  onDoneWithdrawalRequest: (withdrawalRequestId: number) => void;
  onRejectWithdrawalRequest: (withdrawalRequestId: number) => void;
  itemsStatus: WithdrawalRequestStatus;
}

export default function WithdrawalRequestTable({
  withdrawalRequests,
  onDoneWithdrawalRequest,
  onRejectWithdrawalRequest,
  itemsStatus,
}: WithdrawalRequestTableProps) {
  return (
    <table
      className={styles.WithdrawalRequestTable}
      data-items-status={
        {
          [WithdrawalRequestStatus.pending]: "pending",
          [WithdrawalRequestStatus.done]: "done",
          [WithdrawalRequestStatus.rejected]: "rejected",
        }[itemsStatus]
      }
    >
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>مبلغ</th>
          <th>شماره شبا</th>
          <th>نام صاحب حساب</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {withdrawalRequests.map((withdrawalRequest) => (
          <tr key={withdrawalRequest.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={withdrawalRequest.date}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={withdrawalRequest.date} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {withdrawalRequest.user.name}
                </div>
                <div>{withdrawalRequest.user.phoneNumber}</div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ:</span>
              <div>
                <FormattedNumber value={withdrawalRequest.amount} /> تومان
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره شبا:</span>
              <div>
                IR
                <FormattedNumber
                  value={withdrawalRequest.iban}
                  useGrouping={false}
                  minimumIntegerDigits={24}
                />
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نام صاحب حساب:</span>
              <div>{withdrawalRequest.accountHolderName}</div>
            </td>
            <td>
              {withdrawalRequest.status === WithdrawalRequestStatus.pending && (
                <div className={styles.ButtonList}>
                  <button
                    className={styles.RejectButton}
                    onClick={() =>
                      onRejectWithdrawalRequest(withdrawalRequest.id)
                    }
                  >
                    رد کردن
                  </button>
                  <button
                    className={styles.DoneButton}
                    onClick={() =>
                      onDoneWithdrawalRequest(withdrawalRequest.id)
                    }
                  >
                    انجام دادن
                  </button>
                </div>
              )}
              {withdrawalRequest.status !== WithdrawalRequestStatus.pending && (
                <div className={styles.Details}>
                  {withdrawalRequest.rejectReason && (
                    <div>
                      <span>علت:</span>
                      <span>{withdrawalRequest.rejectReason}</span>
                    </div>
                  )}
                  {withdrawalRequest.transactionDate && (
                    <div>
                      <span>تاریخ انجام تراکنش:</span>
                      <span>{withdrawalRequest.transactionDate}</span>
                    </div>
                  )}
                  {withdrawalRequest.trackingNumber && (
                    <div>
                      <span>کد پیگیری تراکنش:</span>
                      <span>{withdrawalRequest.trackingNumber}</span>
                    </div>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}