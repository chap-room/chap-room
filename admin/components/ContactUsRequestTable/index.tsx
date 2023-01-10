import styles from "./style.module.scss";
import { Fragment } from "react";
import { ContactUsRequest } from "@/shared/types";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface ContactUsRequestTableProps {
  contactUsRequests: ContactUsRequest[];
  onDoContactUsRequest: (contactUsRequestId: number) => void;
  itemsStatus: "checked" | null;
}

export default function ContactUsRequestTable({
  contactUsRequests,
  onDoContactUsRequest,
  itemsStatus,
}: ContactUsRequestTableProps) {
  return (
    <table
      className={styles.ContactUsRequestTable}
      data-items-status={itemsStatus}
    >
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>نام ونام خانوادگی</th>
          <th>موبایل</th>
          <th>متن پیام</th>
          <th style={{ width: "1%" }}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {contactUsRequests.map((contactUsRequest) => (
          <tr key={contactUsRequest.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={contactUsRequest.createdAt} />
                </span>
                <span>
                  <FormattedTime value={contactUsRequest.createdAt} />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>نام ونام خانوادگی:</span>
              {contactUsRequest.name}
            </td>
            <td>
              <span className={styles.MobileLabel}>موبایل:</span>
              {contactUsRequest.phoneNumber}
            </td>
            <td>
              <span className={styles.MobileLabel}>متن پیام:</span>
              <div>
                {contactUsRequest.message.split("\n").map((line, index) => (
                  <Fragment key={index}>
                    {index !== 0 && <br />}
                    {line}
                  </Fragment>
                ))}
              </div>
            </td>
            <td>
              {contactUsRequest.checked ? (
                <div className={styles.Done}>انجام شده</div>
              ) : (
                <button
                  className={styles.DoButton}
                  onClick={() => onDoContactUsRequest(contactUsRequest.id)}
                  style={{ minWidth: 80 }}
                >
                  انجام
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
