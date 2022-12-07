import styles from "./style.module.scss";
import { Order } from "@/shared/types";
import { formatNumber } from "@/shared/utils/format";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";

interface OrderTableProps {
  orders: Order[];
  onSeeOrderDetails: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
}

export default function OrderTable({
  orders,
  onSeeOrderDetails,
  onCancelOrder,
}: OrderTableProps) {
  return (
    <table className={styles.OrderTable}>
      <thead>
        <tr>
          <th>شماره سفارش</th>
          <th>تاریخ سفارش</th>
          <th>مبلغ سفارش</th>
          <th>وضعیت</th>
          <th>جزییات</th>
          <th style={{ width: "1%" }}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              <span>{order.id}</span>
            </td>
            <td>
              <span className={styles.MobileLabel}>تاریخ سفارش:</span>
              <span className={styles.Date}>
                <span>
                  <FormattedDate value={order.createdAt} />
                </span>
                <span>
                  <FormattedTime value={order.createdAt} />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              {formatNumber(order.amount)} تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              {order.status === "pending" ? (
                <span className={styles.Pending}>در انتظار بررسی</span>
              ) : order.status === "preparing" ? (
                <span className={styles.Preparing}>در حال آماده سازی</span>
              ) : order.status === "sent" ? (
                <div>
                  <div className={styles.Sent}>ارسال شده</div>
                  {order.trackingUrl && (
                    <div>
                      <a href={order.trackingUrl} target="_blank">
                        رهگیری مرسوله
                      </a>
                    </div>
                  )}
                </div>
              ) : order.status === "canceled" ? (
                <span className={styles.Canceled}>
                  بازگشت وجه به کیف پول
                  <br />
                  {order.cancelReason}
                </span>
              ) : undefined}
            </td>
            <td>
              <button
                className={styles.SeeDetailsButton}
                onClick={() => onSeeOrderDetails(order.id)}
              >
                مشاهده
              </button>
            </td>
            <td>
              {order.status === "canceled" ? (
                <span className={styles.Canceled}>لغو شده</span>
              ) : (
                <button
                  className={styles.CancelButton}
                  onClick={() => onCancelOrder(order.id)}
                  disabled={order.status !== "pending"}
                >
                  لغو سفارش
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
