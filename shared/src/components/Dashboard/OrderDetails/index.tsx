import styles from "./style.module.scss";
import { Order, OrderStatus } from "@chap-room/shared/types";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <table className={styles.OrderDetails} key={order.id}>
      <div>
        <div className={styles.Label}>خلاصه سفارش:</div>
        {order.printFolders.map((printFolder, index) => (
          <div key={index}>
            <div>پوشه {index + 1}:</div>
            <div>
              {printFolder.printColors} / {printFolder.printPaperSize} /{" "}
              {printFolder.printType}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className={styles.Label}>فایل ها:</div>
        {order.printFolders.map((printFolder, index) => (
          <div key={index}>
            <div>پوشه {index + 1}:</div>
            <div>
              {printFolder.printFiles
                .map((printFile) => printFile.name)
                .join(" / ")}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className={styles.Label}>توضیحات سفارش:</div>
        {order.printFolders.map((printFolder, index) => (
          <div key={index}>
            <div>پوشه {index + 1}:</div>
            <div>
              {printFolder.description ? printFolder.description : "(ندارد)"}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className={styles.Label}>تاریخ سفارش:</div>
        <div>
          <span>
            <FormattedDate value={order.date} dateStyle="medium" />
          </span>
          <span>
            <FormattedTime value={order.date} hour12 />
          </span>
        </div>
      </div>
      <div>
        <div className={styles.Label}>تحویل گیرنده:</div>
        <div>{order.recipientName}</div>
      </div>
      <div>
        <div className={styles.Label}>شماره تماس تحویل گیرنده:</div>
        <div>{order.recipientPhoneNumber}</div>
      </div>
      <div>
        <div className={styles.Label}>کدپستی تحویل گیرنده:</div>
        <div>{order.recipientPostalCode}</div>
      </div>
      <div>
        <div className={styles.Label}>نشانی تحویل گیرنده:</div>
        <div>{order.recipientDeliveryAddress}</div>
      </div>
      <div>
        <div className={styles.Label}>مبلغ سفارش:</div>
        <div>
          <FormattedNumber value={order.amount} /> تومان
        </div>
      </div>
      <div>
        <div className={styles.Label}>مبلغ تخفیف:</div>
        <div>
          {order.discountAmount ? (
            <>
              <FormattedNumber value={order.discountAmount} /> تومان
            </>
          ) : (
            "---"
          )}
        </div>
      </div>
      <div>
        <div className={styles.Label}>روش پرداخت:</div>
        <div>
          {Object.entries(order.paymentMethod).map(([method, amount]) => (
            <div key={method}>
              <div>{method}:</div>
              <div>
                <FormattedNumber value={amount} /> تومان
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className={styles.Label}>وضعیت سفارش:</div>
        <div>
          <div>
            <div>{order.status}</div>
            {order.status === OrderStatus.canceled && (
              <div>{order.cancelReason}</div>
            )}
          </div>
          <div>
            <div>
              <FormattedDate
                value={order.lastStatusChange}
                dateStyle="medium"
              />
            </div>
            <div>
              <FormattedTime value={order.lastStatusChange} hour12 />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={styles.Label}>کد رهگیری پستی:</div>
        <div>{order.trackingCode ? order.trackingCode : "---"}</div>
      </div>
      <div>
        <div className={styles.Label}>تاریخ ارسال:</div>
        <div>
          {order.postageDate ? (
            <>
              <span>
                <FormattedDate value={order.postageDate} dateStyle="medium" />
              </span>
              <span>
                <FormattedTime value={order.postageDate} hour12 />
              </span>
            </>
          ) : (
            "---"
          )}
        </div>
      </div>
      <div>
        <div className={styles.Label}>نحوه ارسال:</div>
        <div>{order.postageMethod ? order.postageMethod : "---"}</div>
      </div>
    </table>
  );
}
