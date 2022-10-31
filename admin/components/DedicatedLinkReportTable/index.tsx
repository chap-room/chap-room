import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { DedicatedLinkReport } from "@/shared/types";

interface DedicatedLinkReportTableProps {
  dedicatedLinkReports: DedicatedLinkReport[];
}

export default function DedicatedLinkReportTable({
  dedicatedLinkReports,
}: DedicatedLinkReportTableProps) {
  return (
    <table className={styles.DedicatedLinkReportTable}>
      <thead>
        <tr>
          <th>تاریخ</th>
          <th>کاربر</th>
          <th>خریدار</th>
          <th>شماره سفارش</th>
          <th>مبلغ سفارش</th>
          <th>پورسانت کاربر</th>
          <th>لینک کاربر</th>
        </tr>
      </thead>
      <tbody>
        {dedicatedLinkReports.map((dedicatedLinkReport) => (
          <tr key={dedicatedLinkReport.id}>
            <td>
              <span className={styles.MobileLabel}>تاریخ:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate
                    value={dedicatedLinkReport.date}
                    dateStyle="medium"
                  />
                </span>
                <span>
                  <FormattedTime value={dedicatedLinkReport.date} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>کاربر:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.user.name}
                </div>
                <div className={styles.UserPhoneNumber}>
                  {dedicatedLinkReport.user.phoneNumber}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>خریدار:</span>
              <div>
                <div className={styles.UserName}>
                  {dedicatedLinkReport.customer.name}
                </div>
                <div className={styles.UserPhoneNumber}>
                  {dedicatedLinkReport.customer.phoneNumber}
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              <FormattedNumber
                value={parseInt(dedicatedLinkReport.orderId)}
                useGrouping={false}
              />
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              <FormattedNumber value={dedicatedLinkReport.orderAmount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>پورسانت کاربر:</span>
              <span className={styles.Commission}>
                <span>
                  <FormattedNumber
                    value={
                      dedicatedLinkReport.orderAmount *
                      dedicatedLinkReport.userFee
                    }
                  />{" "}
                  تومان
                </span>
                <span>
                  {"("}
                  <FormattedNumber
                    value={dedicatedLinkReport.userFee}
                    style="percent"
                  />
                  {")"}
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>لینک کاربر:</span>
              <span className={styles.Link}>
                {dedicatedLinkReport.userLink}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
