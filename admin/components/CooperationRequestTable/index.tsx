import styles from "./style.module.scss";
import { FormattedDate, FormattedTime } from "react-intl";
import { CooperationRequest, CooperationRequestStatus } from "@/shared/types";

interface CooperationRequestTableProps {
  cooperationRequests: CooperationRequest[];
  onAcceptCooperationRequest: (
    cooperationRequestId: number,
    cooperationRequestDescription: string | null
  ) => void;
  onRejectCooperationRequest: (
    cooperationRequestId: number,
    cooperationRequestDescription: string | null
  ) => void;
  showDescription?: boolean;
  itemsStatus: CooperationRequestStatus;
}

export default function CooperationRequestTable({
  cooperationRequests,
  onAcceptCooperationRequest,
  onRejectCooperationRequest,
  showDescription = true,
  itemsStatus,
}: CooperationRequestTableProps) {
  return (
    <table
      className={styles.CooperationRequestTable}
      data-items-status={
        {
          [CooperationRequestStatus.pending]: "pending",
          [CooperationRequestStatus.approved]: "approved",
          [CooperationRequestStatus.rejected]: "rejected",
        }[itemsStatus]
      }
    >
      <thead>
        <tr>
          <th>شماره موبایل</th>
          <th>تاریخ</th>
          {showDescription && <th>توضیحات</th>}
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
              <div className={styles.ButtonList}>
                {cooperationRequest.status !==
                  CooperationRequestStatus.approved && (
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
