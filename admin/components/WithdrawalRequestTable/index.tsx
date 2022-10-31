import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import {
  WithdrawalRequest,
  WithdrawalRequestStatus,
} from "@/shared/types";

interface WithdrawalRequestTableProps {
  withdrawalRequests: WithdrawalRequest[];
  onDoneWithdrawalRequest: (withdrawalRequestId: string) => void;
  onRejectWithdrawalRequest: (withdrawalRequestId: string) => void;
}

export default function WithdrawalRequestTable({
  withdrawalRequests,
  onDoneWithdrawalRequest,
  onRejectWithdrawalRequest,
}: WithdrawalRequestTableProps) {
  return (
    <table className={styles.WithdrawalRequestTable}>
      <thead>
        <tr>
          <th>کاربر</th>
          <th>جزئیات</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {withdrawalRequests.map((withdrawalRequest) => (
          <tr key={withdrawalRequest.id}>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {withdrawalRequest.user.name}
                </div>
                <div className={styles.UserPhoneNumber}>
                  {withdrawalRequest.user.phoneNumber}
                </div>
              </div>
            </td>
            <td>
              <div className={styles.Details}>
                <div>
                  <span>تاریخ:</span>
                  <span>
                    <FormattedDate
                      value={withdrawalRequest.date}
                      dateStyle="medium"
                    />{" "}
                    <FormattedTime value={withdrawalRequest.date} hour12 />
                  </span>
                </div>
                <div>
                  <span>مبلغ:</span>
                  <FormattedNumber value={withdrawalRequest.amount} /> تومان
                </div>
                <div>
                  <span>شماره شبا:</span>
                  <span>
                    IR
                    <FormattedNumber
                      value={withdrawalRequest.shabaNumber}
                      useGrouping={false}
                    />
                  </span>
                </div>
                <div>
                  <span>نام صاحب حساب:</span>
                  <span>{withdrawalRequest.accountHolderName}</span>
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              <span
                className={
                  withdrawalRequest.status === WithdrawalRequestStatus.done
                    ? styles.Done
                    : withdrawalRequest.status ===
                      WithdrawalRequestStatus.rejected
                    ? styles.Rejected
                    : withdrawalRequest.status ===
                      WithdrawalRequestStatus.pending
                    ? styles.Pending
                    : undefined
                }
              >
                {withdrawalRequest.status}
              </span>
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
                  {withdrawalRequest.transactionTrackingCode && (
                    <div>
                      <span>کد پیگیری تراکنش:</span>
                      <span>{withdrawalRequest.transactionTrackingCode}</span>
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
