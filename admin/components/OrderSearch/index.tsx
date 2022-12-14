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
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Order } from "@/shared/types";
import {
  cancelOrder,
  confirmOrder,
  getGlobalOrders,
  markOrderSent,
} from "@/admin/api";
import { useDashboardData } from "@/admin/context/dashboardData";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import { FormattedDate, FormattedTime } from "@/shared/components/Formatted";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import OrderCancelDialog from "@/admin/components/OrderCancelDialog";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import OrderSentDialog from "@/admin/components/OrderSentDialog";

export default function OrderSearch() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => {
    if (open && isFirstOpen) {
      setIsFirstOpen(false);
    }
  }, [open]);

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
            placeholder: "?????????? ???? ?????????? ???? ?????? ????????????",
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
                  load={() => getGlobalOrders(search, page)}
                  deps={[search, page]}
                  setData={setData}
                  reloadRef={reloadRef}
                  initialFetch={isFirstOpen}
                >
                  <table className={styles.OrderTable}>
                    <thead>
                      <tr>
                        <th>?????????? ??????????</th>
                        <th>?????????? ??????????</th>
                        <th>????????????</th>
                        <th>????????????</th>
                        <th>?????????? ??????????</th>
                        <th>???? ????????????</th>
                        <th>?????? ??????</th>
                        <th>????????????</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>
                            <div className={styles.Date}>
                              <div>
                                <FormattedDate value={order.createdAt} />
                              </div>
                              <div>
                                <FormattedTime value={order.createdAt} />
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
                              ????????????
                            </button>
                          </td>
                          <td>{order.recipientName}</td>
                          <td>
                            <div
                              className={styles.Status}
                              data-status={order.status}
                            >
                              <div>
                                {
                                  {
                                    canceled: "?????? ??????",
                                    pending: "???? ???????????? ??????????",
                                    preparing: "???? ?????? ?????????? ????????",
                                    sent: "?????????? ?????? ",
                                  }[order.status]
                                }
                              </div>
                              <div>
                                <FormattedDate value={order.updatedAt} />
                              </div>
                            </div>
                          </td>
                          <td>
                            {order.status === "sent" ? (
                              <div>
                                {order.trackingNumber && (
                                  <div>{order.trackingNumber}</div>
                                )}
                                {order.trackingUrl && (
                                  <div>
                                    <a href={order.trackingUrl} target="_blank">
                                      ???????????? ????????????
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
                                    ??????
                                  </button>
                                  <button
                                    className={styles.ConfirmButton}
                                    onClick={() =>
                                      setPendingOrderConfirmRequest(order.id)
                                    }
                                  >
                                    ????????????
                                  </button>
                                </>
                              ) : order.status === "preparing" ? (
                                <button
                                  className={styles.MarkAsSentButton}
                                  onClick={() =>
                                    setPendingMarkOrderSentRequest(order.id)
                                  }
                                >
                                  ?????????? ????
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
                    <EmptyNote>?????? ???????????? ???????? ??????????</EmptyNote>
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
                dashboardData.loaderState.reload();
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
              dashboardData.loaderState.reload();
            })
            .catch(toast.error)
        }
        message="???? ???????????? ???????? ?????? ?????????? ?????????? ????????????"
        confirmButtonText="????????????"
      />
      {pendingMarkOrderSentRequest !== null && (
        <OrderSentDialog
          onClose={() => {
            setPendingMarkOrderSentRequest(null);
            setOpen(true);
          }}
          onMarkOrderSent={(markOrderSentData) =>
            markOrderSent(pendingMarkOrderSentRequest!, markOrderSentData)
              .then((message) => {
                toast.success(message);
                setPendingMarkOrderSentRequest(null);
                setOpen(true);
                if (reloadRef.current) reloadRef.current();
                dashboardData.loaderState.reload();
              })
              .catch(toast.error)
          }
          orderId={pendingMarkOrderSentRequest || 0}
        />
      )}
    </>
  );
}
