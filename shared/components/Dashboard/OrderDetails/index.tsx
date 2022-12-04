import styles from "./style.module.scss";
import { Order } from "@/shared/types";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  useIntl,
} from "react-intl";
import { englishToPersianNumbers } from "@/shared/utils/numbers";

interface OrderDetailsProps {
  order: Order;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const intl = useIntl();

  return (
    <table className={styles.OrderDetails} key={order.id}>
      <tbody>
        <tr>
          <td colSpan={2} className={styles.Cell50}>
            <div className={styles.Cell}>
              <div className={styles.Label}>خلاصه سفارش:</div>
              <div className={styles.Summary}>
                {order.printFolders.map((printFolder, index) => (
                  <div key={index}>
                    <div>پوشه {index + 1}:</div>
                    <div>
                      {[
                        {
                          blackAndWhite: "سیاه و سفید",
                          normalColor: "رنگی معمولی",
                          fullColor: "تمام رنگی",
                        }[printFolder.printColor],
                        { a4: "A4", a5: "A5", a3: "A3" }[printFolder.printSize],
                        { singleSided: "یک رو", doubleSided: "دو رو" }[
                          printFolder.printSide
                        ],
                        `${intl.formatNumber(printFolder.countOfPages)} صفحه`,
                        ...(printFolder.bindingOptions === null
                          ? []
                          : [
                              "صحافی",
                              {
                                springNormal: "فنر با طلق معمولی",
                                springPapco: "فنر با طلق پاپکو",
                                stapler: "منگنه",
                              }[printFolder.bindingOptions.bindingType],
                              printFolder.bindingOptions.bindingMethod !==
                              "countOfFiles"
                                ? {
                                    allFilesTogether: "هر فایل جدا",
                                    eachFileSeparated: "همه فایل ها با هم",
                                  }[printFolder.bindingOptions.bindingMethod]
                                : `${intl.formatNumber(
                                    printFolder.bindingOptions.countOfFiles || 0
                                  )} فایل`,
                              {
                                colorful: "جلد رنگی",
                                blackAndWhite: "جلد سیاه و سفید",
                              }[printFolder.bindingOptions.coverColor],
                            ]),
                        `${intl.formatNumber(
                          printFolder.countOfCopies || 1
                        )} نسخه`,
                      ].join(" / ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </td>
          <td colSpan={2} className={styles.Cell50}>
            <div className={styles.Cell}>
              <div className={styles.Label}>فایل ها:</div>
              <div className={styles.Files}>
                {order.printFolders.map((printFolder, index) => {
                  const uploadedPages = printFolder.printFiles.reduce(
                    (result, item) => result + (item.countOfPages || 0),
                    0
                  );

                  return (
                    <div key={index}>
                      <div>پوشه {englishToPersianNumbers(index + 1)}:</div>
                      {printFolder.filesManuallySent ? (
                        <div>از طریق تلگرام و ایتا</div>
                      ) : (
                        <div>
                          <span>
                            <FormattedNumber
                              value={printFolder.printFiles.length}
                            />{" "}
                            فایل
                          </span>
                          <a href={printFolder.filesUrl} target="_blank">
                            دانلود
                          </a>
                          <span
                            className={
                              uploadedPages === printFolder.countOfPages
                                ? styles.Match
                                : styles.NotMatch
                            }
                          >
                            مجموع:{" "}
                            <FormattedNumber value={printFolder.countOfPages} />{" "}
                            صفحه
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={4} className={styles.Cell100}>
            <div className={styles.Cell}>
              <div className={styles.Label}>توضیحات سفارش:</div>
              <div className={styles.Descriptions}>
                {order.printFolders.map((printFolder, index) => (
                  <div key={index}>
                    <div>پوشه {index + 1}:</div>
                    <div>
                      {printFolder.description
                        ? printFolder.description
                        : "(ندارد)"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>تاریخ سفارش:</div>
              <div className={styles.OrderDate}>
                <span>
                  <FormattedDate value={new Date(order.createdAt)} />
                </span>
                <span>
                  <FormattedTime
                    value={new Date(order.createdAt)}
                    timeStyle="medium"
                  />
                </span>
              </div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>تحویل گیرنده:</div>
              <div>{order.recipientName}</div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>شماره تماس تحویل گیرنده:</div>
              <div>{englishToPersianNumbers(order.recipientPhoneNumber)}</div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>کدپستی تحویل گیرنده:</div>
              <div>{englishToPersianNumbers(order.recipientPostalCode)}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={4} className={styles.Cell100}>
            <div className={styles.Cell}>
              <div className={styles.Label}>نشانی تحویل گیرنده:</div>
              <div>
                استان {order.recipientDeliveryProvince}، شهر{" "}
                {order.recipientDeliveryCity}، {order.recipientDeliveryAddress}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>مبلغ سفارش:</div>
              <div className={styles.OrderAmount}>
                <div>
                  <FormattedNumber value={order.amount} /> تومان
                </div>
                {order.postageFee && (
                  <div>
                    <span>ارسال:</span>
                    <span>
                      <FormattedNumber value={order.postageFee} /> تومان
                    </span>
                  </div>
                )}
              </div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>مبلغ تخفیف:</div>
              {order.discountAmount ? (
                <div className={styles.DiscountAmount}>
                  <div>
                    <FormattedNumber value={order.discountAmount} /> تومان
                  </div>
                  {order.discountCode && (
                    <div>
                      <span>کد:</span>
                      <span>{order.discountCode}</span>
                    </div>
                  )}
                </div>
              ) : (
                "---"
              )}
            </div>
          </td>
          <td
            colSpan={2}
            className={[styles.Cell50, styles.PaymentMethodTd].join(" ")}
          >
            <div className={styles.Cell}>
              <div className={styles.Label}>روش پرداخت:</div>
              <div className={styles.PaymentMethod}>
                {!!order.gatewayPaidAmount && (
                  <div>
                    <div>درگاه پرداخت:</div>
                    <div>
                      <FormattedNumber value={order.gatewayPaidAmount} /> تومان
                    </div>
                  </div>
                )}
                {!!order.walletPaidAmount && (
                  <div>
                    <div>کیف پول:</div>
                    <div>
                      <FormattedNumber value={order.walletPaidAmount} /> تومان
                    </div>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>وضعیت سفارش:</div>
              <div className={styles.OrderStatus}>
                <div
                  className={
                    {
                      canceled: styles.Canceled,
                      pending: styles.Pending,
                      preparing: styles.Preparing,
                      sent: styles.Sent,
                    }[order.status]
                  }
                >
                  <div>
                    {
                      {
                        canceled: "لغو شده",
                        pending: "در انتظار بررسی",
                        preparing: "در حال آماده سازی",
                        sent: "ارسال شده",
                      }[order.status]
                    }
                  </div>
                  {order.status === "canceled" && (
                    <div>{order.cancelReason}</div>
                  )}
                </div>
                <div>
                  <div>
                    <FormattedDate value={new Date(order.updatedAt)} />
                  </div>
                  <div>
                    <FormattedTime
                      value={new Date(order.updatedAt)}
                      timeStyle="medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>کد پیگیری پستی:</div>
              <div>
                {order.trackingNumber
                  ? englishToPersianNumbers(order.trackingNumber)
                  : "---"}
              </div>
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>تاریخ ارسال:</div>
              {order.postageAt ? (
                <div className={styles.OrderPostageDate}>
                  <span>
                    <FormattedDate value={new Date(order.postageAt)} />
                  </span>
                  <span>
                    <FormattedTime
                      value={new Date(order.postageAt)}
                      timeStyle="medium"
                    />
                  </span>
                </div>
              ) : (
                "---"
              )}
            </div>
          </td>
          <td className={styles.Cell25}>
            <div className={styles.Cell}>
              <div className={styles.Label}>نحوه ارسال:</div>
              <div>{order.postageMethod ? order.postageMethod : "---"}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
