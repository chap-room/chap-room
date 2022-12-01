import styles from "./style.module.scss";
import React, { useEffect, useRef, useState } from "react";
import {
  useFloating,
  offset,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingFocusManager,
  autoUpdate,
  size,
  useFocus,
} from "@floating-ui/react-dom-interactions";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  useIntl,
} from "react-intl";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Order } from "@/shared/types";
import {
  cancelOrder,
  confirmOrder,
  getOrders,
  markOrderSent,
  request,
} from "@/admin/api";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";
import { orderConvertMap } from "@/main/convertMaps";
import { convert } from "@/shared/utils/convert";

export default function OrderSearch() {
  const [open, setOpen] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (open && isFirstOpen) {
      setIsFirstOpen(false);
    }
  }, [open]);

  const router = useRouter();

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    orders: Order[];
  }>({ totalCount: 0, pageSize: 0, orders: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    number | null
  >(null);
  const [pendingOrderConfirmRequest, setPendingOrderConfirmRequest] = useState<
    number | null
  >(null);
  const [pendingMarkOrderSentRequest, setPendingMarkOrderSentRequest] =
    useState<number | null>(null);

  const reloadRef = useRef<(() => void) | null>(null);

  const { x, y, reference, floating, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(20),
      size({
        apply({ elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            minWidth: `${
              (elements.reference as HTMLElement).parentElement?.parentElement
                ?.clientWidth || 0
            }px`,
            height: `${Math.min(availableHeight, 400)}px`,
          });
        },
        padding: 8,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context, { toggle: false, keyboardHandlers: false }),
    useFocus(context),
    useDismiss(context),
    useRole(context),
  ]);

  return (
    <>
      <div className={styles.SearchInputContainer} ref={reference}>
        <SearchInput
          inputProps={getReferenceProps({
            placeholder: "جستجو کد سفارش یا نام گیرنده",
          })}
          boxProps={{ style: { width: 330 } }}
          value={search}
          setValue={(newValue) => {
            setSearch(newValue);
            setPage(1);
          }}
        />
      </div>
      {pendingOrderCancelRequest === null &&
        pendingOrderConfirmRequest === null &&
        pendingMarkOrderSentRequest === null &&
        open && (
          <FloatingFocusManager context={context}>
            <div
              className={styles.Popover}
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
              }}
              {...getFloatingProps()}
            >
              <div>
                <DataLoader
                  load={() =>
                    request({
                      method: "GET",
                      url: "/admins/orders/global",
                      needAuth: true,
                      params: { search, page },
                    }).then(({ data }) => ({
                      totalCount: data.totalCount,
                      pageSize: data.pageSize,
                      orders: data.orders.map((item: any) =>
                        convert(orderConvertMap, item, "a2b")
                      ) as Order[],
                    }))
                  }
                  deps={[search, page, null]}
                  setData={setData}
                  reloadRef={reloadRef}
                  initialFetch={isFirstOpen}
                >
                  <table className={styles.OrderTable}>
                    <thead>
                      <tr>
                        <th>شماره سفارش</th>
                        <th>تاریخ سفارش</th>
                        <th>جزییات</th>
                        <th>گیرنده</th>
                        <th>وضعیت سفارش</th>
                        <th>کد پیگیری</th>
                        <th>علت لغو</th>
                        <th style={{ width: "1%" }}>عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order) => (
                        <tr key={order.id}>
                          <td>{englishToPersianNumbers(order.id)}</td>
                          <td>
                            <div className={styles.Date}>
                              <div>
                                <FormattedDate
                                  value={new Date(order.createdAt)}
                                />
                              </div>
                              <div>
                                <FormattedTime
                                  value={new Date(order.createdAt)}
                                  timeStyle="medium"
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <button
                              className={styles.SeeDetailsButton}
                              onClick={() =>
                                router.push(
                                  `/dashboard/orders/${order.id}/details`
                                )
                              }
                            >
                              مشاهده
                            </button>
                          </td>
                          <td>{order.recipientName}</td>
                          <td>
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
                                <FormattedDate
                                  value={new Date(order.updatedAt)}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            {order.status === "sent" ? (
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
                            ) : (
                              <span className={styles.NotApplicable}>-</span>
                            )}
                          </td>
                          <td>
                            {order.status === "canceled" ? (
                              <span className={styles.CancelReason}>
                                {order.cancelReason}
                              </span>
                            ) : (
                              <span className={styles.NotApplicable}>-</span>
                            )}
                          </td>
                          <td>
                            <div className={styles.ButtonList}>
                              {order.status === "pending" ? (
                                <>
                                  <button
                                    className={styles.CancelButton}
                                    onClick={() =>
                                      setPendingOrderCancelRequest(order.id)
                                    }
                                  >
                                    لغو
                                  </button>
                                  <button
                                    className={styles.ConfirmButton}
                                    onClick={() =>
                                      setPendingOrderConfirmRequest(order.id)
                                    }
                                  >
                                    تأیید
                                  </button>
                                </>
                              ) : order.status === "preparing" ? (
                                <button
                                  className={styles.MarkAsSentButton}
                                  onClick={() =>
                                    setPendingMarkOrderSentRequest(order.id)
                                  }
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
                  {!data.orders.length && (
                    <EmptyNote>هیچ سفارشی وجود ندارد</EmptyNote>
                  )}
                  <Pagination
                    currentPage={page}
                    totalCount={data.totalCount}
                    pageSize={data.pageSize}
                    onPageChange={setPage}
                  />
                </DataLoader>
              </div>
            </div>
          </FloatingFocusManager>
        )}
      {pendingOrderCancelRequest !== null && (
        <OrderCancelDialog
          onClose={() => {
            setPendingOrderCancelRequest(null);
            setOpen(true);
          }}
          onCancelOrder={(reason) =>
            cancelOrder(pendingOrderCancelRequest!, reason)
              .then((message) => {
                toast.success(message);
                setPendingOrderCancelRequest(null);
                setOpen(true);
                if (reloadRef.current) reloadRef.current();
              })
              .catch(toast.error)
          }
        />
      )}
      <WarningConfirmDialog
        open={pendingOrderConfirmRequest !== null}
        onClose={() => {
          setPendingOrderConfirmRequest(null);
          setOpen(true);
        }}
        onConfirm={() =>
          confirmOrder(pendingOrderConfirmRequest!)
            .then((message) => {
              toast.success(message);
              setPendingOrderConfirmRequest(null);
              setOpen(true);
              if (reloadRef.current) reloadRef.current();
            })
            .catch(toast.error)
        }
        message="از تأیید کردن این سفارش مطمئن هستید؟"
        confirmButtonText="تأیید"
      />
      {pendingMarkOrderSentRequest !== null && (
        <OrderSentDialog
          onClose={() => {
            setPendingMarkOrderSentRequest(null);
            setOpen(true);
          }}
          onMarkOrderSent={(trackingCode) =>
            markOrderSent(pendingMarkOrderSentRequest!, trackingCode)
              .then((message) => {
                toast.success(message);
                setPendingMarkOrderSentRequest(null);
                setOpen(true);
                if (reloadRef.current) reloadRef.current();
              })
              .catch(toast.error)
          }
        />
      )}
    </>
  );
}
