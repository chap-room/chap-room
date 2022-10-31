import styles from "./style.module.scss";
import {
  FinancialRecord,
  FinancialRecordStatus,
} from "@/shared/types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import IconButton from "@/shared/components/IconButton";

interface FinancialRecordTableProps {
  financialRecords: FinancialRecord[];
  onSeeDetails: (orderId: string) => void;
  onEditFinancialRecord: (financialRecordId: string) => void;
  onDeleteFinancialRecord: (financialRecordId: string) => void;
}

export default function FinancialRecordTable({
  financialRecords,
  onSeeDetails,
  onEditFinancialRecord,
  onDeleteFinancialRecord,
}: FinancialRecordTableProps) {
  return (
    <table className={styles.FinancialRecordTable}>
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>مبلغ</th>
          <th>جزییات</th>
          <th>نوع</th>
          <th>وضعیت</th>
        </tr>
      </thead>
      <tbody>
        {financialRecords.map((financialRecord) => (
          <tr key={financialRecord.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={financialRecord.date}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={financialRecord.date} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {financialRecord.user.name}
                </div>
                <div className={styles.UserPhoneNumber}>
                  {financialRecord.user.phoneNumber}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ:</span>
              <FormattedNumber value={financialRecord.amount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>جزییات:</span>
              {!financialRecord.orderId ? (
                <span>{financialRecord.details}</span>
              ) : (
                <button
                  className={styles.SeeDetailsButton}
                  onClick={() => onSeeDetails(financialRecord.orderId!)}
                >
                  مشاهده
                </button>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>نوع:</span>
              {financialRecord.type}
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              {financialRecord.status !==
              FinancialRecordStatus.addedManually ? (
                <span
                  className={
                    financialRecord.status === FinancialRecordStatus.successful
                      ? styles.Successful
                      : styles.Unsuccessful
                  }
                >
                  {financialRecord.status}
                </span>
              ) : (
                <div>
                  <div>دستی توسط: {financialRecord.addedBy?.name}</div>
                  <div className={styles.OperationButtons}>
                    <div className={styles.EditButton}>
                      <IconButton
                        varient="none"
                        size={34}
                        onClick={() => onEditFinancialRecord(financialRecord.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                    <div className={styles.DeleteButton}>
                      <IconButton
                        varient="none"
                        size={34}
                        onClick={() => onDeleteFinancialRecord(financialRecord.id)}
                      >
                        <DeletetIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
