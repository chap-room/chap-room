import styles from "./style.module.scss";
import { Order, OrderStatus } from "../../../types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { Link } from "react-router-dom";

interface OrderTabelProps {
  orders: Order[];
  onSeeDetails: (orderId: string) => void;
}

export default function OrderTabel({ orders, onSeeDetails }: OrderTabelProps) {
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
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>
              <span className={styles.Date}>
                <FormattedDate value={order.date} dateStyle="medium" />
                <br />
                <FormattedTime value={order.date} hour12 />
              </span>
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
                      <>
                        <span className={styles.Sent}>{order.status}</span>
                        <br />
                        <Link to="" className={styles.TrackingLink}>
                          رهگیری مرسوله
                        </Link>
                      </>
                    );
                  case OrderStatus.canceled:
                    return (
                      <span className={styles.Canceled}>
                        {order.cancelReason}
                      </span>
                    );
                }
              })()}
            </td>
            <td>
              {order.status === OrderStatus.canceled ? (
                <span className={styles.Successful}>{order.status}</span>
              ) : (
                <span className={styles.Unsuccessful}>{order.status}</span>
              )}
            </td>
            <td>
              {order.status === OrderStatus.pending ? (
                <span className={styles.Successful}>{order.status}</span>
              ) : (
                <span className={styles.Unsuccessful}>{order.status}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
