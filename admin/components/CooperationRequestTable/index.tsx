import styles from "./style.module.scss";
import { FormattedDate, FormattedTime } from "react-intl";
import {
  CooperationRequest,
  CooperationRequestStatus,
} from "@/shared/types";

interface CooperationRequestTableProps {
  cooperationRequests: CooperationRequest[];
  onAcceptCooperationRequest: (
    cooperationRequestId: string,
    cooperationRequestDescription: string | null
  ) => void;
  onRejectCooperationRequest: (
    cooperationRequestId: string,
    cooperationRequestDescription: string | null
  ) => void;
  showDescription?: boolean;
}

export default function CooperationRequestTable({
  cooperationRequests,
  onAcceptCooperationRequest,
  onRejectCooperationRequest,
  showDescription = true,
}: CooperationRequestTableProps) {
  return (
    <table className={styles.CooperationRequestTable}>
      <thead>
        <tr>
          <th>شماره موبایل</th>
          <th>تاریخ</th>
          {showDescription && <th>توضیحات</th>}
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {cooperationRequests.map((cooperationRequest) => (
          <tr key={cooperationRequest.id}>
            <td>
              <span className={styles.MobileLabel}>شماره موبایل:</span>
              {cooperationRequest.phoneNumber}
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={cooperationRequest.date}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={cooperationRequest.date} hour12 />
                </span>
              </span>
            </td>
            {showDescription && (
              <td>
                <span className={styles.MobileLabel}>توضیحات:</span>
                <span>{cooperationRequest.description || "---"}</span>
              </td>
            )}
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              <span
                className={
                  cooperationRequest.status ===
                  CooperationRequestStatus.accepted
                    ? styles.Accepted
                    : cooperationRequest.status ===
                      CooperationRequestStatus.rejected
                    ? styles.Rejected
                    : cooperationRequest.status ===
                      CooperationRequestStatus.pending
                    ? styles.Pending
                    : undefined
                }
              >
                {cooperationRequest.status}
              </span>
            </td>
            <td>
              <div className={styles.ButtonList}>
                {cooperationRequest.status !==
                  CooperationRequestStatus.accepted && (
                  <button
                    className={styles.AcceptButton}
                    onClick={() =>
                      onAcceptCooperationRequest(
                        cooperationRequest.id,
                        cooperationRequest.description
                      )
                    }
                  >
                    تایید کردن
                  </button>
                )}
                {cooperationRequest.status !==
                  CooperationRequestStatus.rejected && (
                  <button
                    className={styles.RejectButton}
                    onClick={() =>
                      onRejectCooperationRequest(
                        cooperationRequest.id,
                        cooperationRequest.description
                      )
                    }
                  >
                    رد کردن
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
