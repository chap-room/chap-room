import styles from "./style.module.scss";
import { FinancialRecord } from "@/shared/types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import IconButton from "@/shared/components/IconButton";

interface FinancialRecordTableProps {
  financialRecords: FinancialRecord[];
  onSeeDetails: (orderId: number) => void;
  onEditFinancialRecord: (financialRecordId: number) => void;
  onDeleteFinancialRecord: (financialRecordId: number) => void;
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
                  <FormattedDate value={new Date(financialRecord.createdAt)} />
                </span>
                <span>
                  <FormattedTime
                    value={new Date(financialRecord.createdAt)}
                    timeStyle="medium"
                  />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {financialRecord.user.name}
                </div>
                <div>
                  {englishToPersianNumbers(financialRecord.user.phoneNumber)}
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
                <span>{financialRecord.description}</span>
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
              {!financialRecord.admin ? (
                <span
                  className={
                    financialRecord.status === "successful"
                      ? styles.Successful
                      : styles.Unsuccessful
                  }
                >
                  {
                    {
                      successful: "موفق",
                      unsuccessful: "نا موفق",
                    }[financialRecord.status]
                  }
                </span>
              ) : (
                <div>
                  <div>دستی توسط: {financialRecord.admin.name}</div>
                  <div className={styles.OperationButtons}>
                    <div className={styles.EditButton}>
                      <IconButton
                        varient="none"
                        size={34}
                        onClick={() =>
                          onEditFinancialRecord(financialRecord.id)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </div>
                    <div className={styles.DeleteButton}>
                      <IconButton
                        varient="none"
                        size={34}
                        onClick={() =>
                          onDeleteFinancialRecord(financialRecord.id)
                        }
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
