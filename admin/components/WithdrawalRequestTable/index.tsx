import styles from "./style.module.scss";
import { WithdrawalRequest } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface WithdrawalRequestTableProps {
  withdrawalRequests: WithdrawalRequest[];
  onDoWithdrawalRequest: (withdrawalRequestId: number) => void;
  onRejectWithdrawalRequest: (withdrawalRequestId: number) => void;
  itemsStatus: "done" | "rejected" | "pending";
}

export default function WithdrawalRequestTable({
  withdrawalRequests,
  onDoWithdrawalRequest,
  onRejectWithdrawalRequest,
  itemsStatus,
}: WithdrawalRequestTableProps) {
  return (
    <table
      className={styles.WithdrawalRequestTable}
      data-items-status={itemsStatus}
    >
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>مبلغ</th>
          <th>شماره شبا</th>
          <th>نام صاحب حساب</th>
          <th style={{ width: "1%" }}>عملیات</th>
          <th>توضیحات</th>
          <th>کد پیگیری</th>
        </tr>
      </thead>
      <tbody>
        {withdrawalRequests.map((withdrawalRequest) => (
          <tr key={withdrawalRequest.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={withdrawalRequest.createdAt} />
                </span>
                <span>
                  <FormattedTime value={withdrawalRequest.createdAt} />
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
              <div>{formatNumber(withdrawalRequest.amount)} تومان</div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره شبا:</span>
              <div>
                IR
                {withdrawalRequest.iban}
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>نام صاحب حساب:</span>
              <div>{withdrawalRequest.accountHolderName}</div>
            </td>
            <td>
              {withdrawalRequest.status === "pending" && (
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
                    className={styles.DoButton}
                    onClick={() =>
                      onDoWithdrawalRequest(withdrawalRequest.id)
                    }
                  >
                    انجام دادن
                  </button>
                </div>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>span:</span>
              {withdrawalRequest.description && (
                <div>{withdrawalRequest.description}</div>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>توضیحات:</span>
              <div>
                {withdrawalRequest.transactionDate && (
                  <div>{withdrawalRequest.transactionDate}</div>
                )}
                {withdrawalRequest.trackingNumber && (
                  <div>{withdrawalRequest.trackingNumber}</div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
