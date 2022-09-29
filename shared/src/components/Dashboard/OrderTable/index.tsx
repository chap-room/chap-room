import styles from "./style.module.scss";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { Order, OrderStatus } from "@chap-room/shared/types";

interface OrderTableProps {
  orders: Order[];
  onSeeOrderDetails: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
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
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>
              <span className={styles.MobileLabel}>شماره سفارش:</span>
              {order.id}
            </td>
            <td>
              <span className={styles.MobileLabel}>زمان سفارش:</span>
              <span>
                <span>
                  <FormattedDate value={order.date} dateStyle="medium" />
                </span>
                <br />
                <span>
                  <FormattedTime value={order.date} hour12 />
                </span>
              </span>
            </td>
            <td>
              <span className={styles.MobileLabel}>مبلغ سفارش:</span>
              <FormattedNumber value={order.amount} /> تومان
            </td>
            <td>
              <span className={styles.MobileLabel}>وضعیت:</span>
              {(() => {
                switch (order.status) {
                  case OrderStatus.pending:
                    return (
                      <span className={styles.Pending}>{order.status}</span>
                    );
                  case OrderStatus.preparing:
                    return (
                      <span className={styles.Preparing}>{order.status}</span>
                    );
                  case OrderStatus.sent:
                    return (
                      <span>
                        <span className={styles.Sent}>{order.status}</span>
                        <br />
                        <a
                          href="/"
                          target="_blank"
                          className={styles.TrackingLink}
                        >
                          رهگیری مرسوله
                        </a>
                      </span>
                    );
                  case OrderStatus.canceled:
                    return (
                      <span className={styles.Canceled}>
                        {order.cancelReason}
                        <br />
                        بازگشت وجه به کیف پول
                      </span>
                    );
                }
              })()}
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
              {order.status === OrderStatus.canceled ? (
                <span className={styles.Canceled}>{order.status}</span>
              ) : (
                <button
                  className={styles.CancelButton}
                  onClick={() => onCancelOrder(order.id)}
                  disabled={order.status !== OrderStatus.pending}
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
