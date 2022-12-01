import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { Order } from "@/shared/types";
import { englishToPersianNumbers } from "@/shared/utils/numbers";

interface OrderTableProps {
  orders: Order[];
  onSeeOrderDetails: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
  onConfirmOrder: (orderId: number) => void;
  onMarkOrderSent: (orderId: number) => void;
  itemsStatus: "canceled" | "pending" | "preparing" | "sent" | null;
}

export default function OrderTable({
  orders,
  onSeeOrderDetails,
  onCancelOrder,
  onConfirmOrder,
  onMarkOrderSent,
  itemsStatus,
}: OrderTableProps) {
  return (
    <table
      className={styles.OrderTable}
      data-items-status={itemsStatus !== null ? itemsStatus : "null"}
    >
      <thead>
        <tr>
          <th>شماره سفارش</th>
          <th>تاریخ سفارش</th>
          <th>مبلغ سفارش</th>
          <th>جزییات</th>
          <th>وضعیت</th>
          <th>کد پیگیری</th>
          <th>علت لغو</th>
          <th style={{ width: "1%" }}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              {englishToPersianNumbers(order.id)}
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ سفارش:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={order.date} />
                </span>
                <span>
                  <FormattedTime value={order.date} timeStyle="medium" />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              <FormattedNumber value={order.amount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>جزییات:</span>
              <button
                className={styles.SeeDetailsButton}
                onClick={() => onSeeOrderDetails(order.id)}
              >
                مشاهده
              </button>
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              <div className={styles.Status}>
                <div>
                  {
                    {
                      canceled: "لغو شده",
                      pending: "در انتظار بررسی",
                      preparing: "در حال آماده سازی",
                      sent: "ارسال شده ",
                    }[order.status]
                  }
                </div>
                <div>
                  <FormattedDate value={order.lastUpdateDate} />
                </div>
              </div>
            </td>
            <td>
              <span className={styles.MobileLabel}>کد پیگیری:</span>
              {order.status === "sent" ? (
                <div className={styles.TrackingNumber}>
                  <div>{order.trackingNumber}</div>
                  <div>
                    <a href="/" target="_blank">
                      رهگیری مرسوله
                    </a>
                  </div>
                </div>
              ) : (
                <span className={styles.NotApplicable}>-</span>
              )}
            </td>
            <td>
              <span className={styles.MobileLabel}>علت لغو:</span>
              {order.status === "canceled" ? (
                <span className={styles.CancelReason}>
                  {order.cancelReason}
                </span>
              ) : (
                <span className={styles.NotApplicable}>-</span>
              )}
            </td>
            <td
              className={
                order.status !== "pending" && order.status !== "preparing"
                  ? styles.NoButtons
                  : undefined
              }
            >
              <div className={styles.ButtonList}>
                {order.status === "pending" ? (
                  <>
                    <button
                      className={styles.CancelButton}
                      onClick={() => onCancelOrder(order.id)}
                    >
                      لغو
                    </button>
                    <button
                      className={styles.ConfirmButton}
                      onClick={() => onConfirmOrder(order.id)}
                    >
                      تأیید
                    </button>
                  </>
                ) : order.status === "preparing" ? (
                  <button
                    className={styles.MarkAsSentButton}
                    onClick={() => onMarkOrderSent(order.id)}
                  >
                    ارسال شد
                  </button>
                ) : (
                  <span className={styles.NotApplicable}>-</span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
