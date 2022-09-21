import styles from "./style.module.scss";
import { Order, OrderStatus } from "../../../types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";

interface InProgressOrderTableProps {
  orders: Order[];
  onSeeOrderDetails: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export default function InProgressOrderTable({
  orders,
  onSeeOrderDetails,
  onCancelOrder,
}: InProgressOrderTableProps) {
  const inProgressOrders = orders.filter((item) =>
    [OrderStatus.pending, OrderStatus.preparing].includes(item.status)
  );

  return (
    <table className={styles.OrderTabel}>
      <thead>
        <tr>
          <th>شماره سفارش</th>
          <th>زمان سفارش</th>
          <th>مبلغ سفارش</th>
          <th>وضعیت</th>
          <th>جزییات</th>
          <th>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {inProgressOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>
              <FormattedDate value={order.date} dateStyle="medium" />
              <br />
              <FormattedTime value={order.date} hour12 />
            </td>
            <td>
              <FormattedNumber value={order.amount} /> تومان
            </td>
            <td>
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
