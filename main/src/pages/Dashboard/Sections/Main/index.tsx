import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { OrderStatus, PrintPaperSize } from "@chap-room/shared/types";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import { ReactComponent as AddIcon } from "@chap-room/shared/assets/icons/add.svg";
import { ReactComponent as PrintingImage } from "@chap-room/shared/assets/images/printing.svg";
import Avatar from "@chap-room/shared/components/Dashboard/Avatar";
import Wallet from "@chap-room/main/components/Dashboard/Wallet";
import DashboardNavLinks from "@chap-room/main/components/Dashboard/NavLinks";
import SectionHeader from "@chap-room/shared/components/Dashboard/SectionHeader";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import SwitchButtons from "@chap-room/shared/components/SwitchButtons";
import PrintPrices from "@chap-room/main/components/PrintPrices";
import Button from "@chap-room/shared/components/Button";
import Switch from "@chap-room/shared/components/Switch";
import OrderTable from "@chap-room/shared/components/Dashboard/OrderTable";
import WarningConfirmDialog from "@chap-room/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardMain() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const inProgressOrders = data.state.orders.filter((item) =>
    [OrderStatus.pending, OrderStatus.preparing].includes(item.status)
  );

  const [pricesPrintPaperSize, setPricesPrintPaperSize] = useState(
    PrintPaperSize.a4
  );
  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);

  return (
    <>
      <Helmet title="داشبورد" />
      <SectionHeader title="داشبورد" />
      <div className={styles.Container}>
        <div className={styles.Mobile}>
          <div className={styles.User}>
            <Avatar user={data.state.currentUser} />
            <div className={styles.Meta}>
              <div className={styles.PhoneNumber}>
                {data.state.currentUser.phoneNumber}
              </div>
              <div className={styles.Name}>{data.state.currentUser.name}</div>
            </div>
          </div>
          <div className={styles.Welcome}>!خوش‌آمدی</div>
          <Wallet />
          <DashboardNavLinks />
        </div>
        <div className={styles.NonMobile}>
          <div className={styles.ContentContainer}>
            <div>
              <SectionContent>
                <div className={styles.WelcomeUser}>
                  سلام {data.state.currentUser.name}
                </div>
                <div className={styles.DashboardDescription}>
                  خلاصه‌ای از همه چیز را ببینید
                </div>
                <div className={styles.Printing}>
                  <PrintingImage />
                </div>
              </SectionContent>
              <SectionContent>
                <ContentHeader
                  title="هزینه ها"
                  end={
                    <div className={styles.PricesPrintPaperSizeButtons}>
                      <SwitchButtons
                        options={{
                          [PrintPaperSize.a4]: PrintPaperSize.a4,
                          [PrintPaperSize.a3]: PrintPaperSize.a3,
                          [PrintPaperSize.a5]: PrintPaperSize.a5,
                        }}
                        value={pricesPrintPaperSize}
                        onChange={(newValue) =>
                          setPricesPrintPaperSize(newValue as PrintPaperSize)
                        }
                      />
                    </div>
                  }
                />
                <Switch
                  currentViewId={pricesPrintPaperSize}
                  views={[
                    {
                      id: PrintPaperSize.a4,
                      content: <PrintPrices />,
                    },
                    {
                      id: PrintPaperSize.a3,
                      content: <PrintPrices />,
                    },
                    {
                      id: PrintPaperSize.a5,
                      content: <PrintPrices />,
                    },
                  ]}
                />
              </SectionContent>
            </div>
            <SectionContent>
              <ContentHeader
                title="سفارش های در حال انجام"
                end={
                  <Button
                    style={{ padding: 0 }}
                    onClick={() => navigate("/dashboard/orders/new")}
                  >
                    سفارش جدید <AddIcon />
                  </Button>
                }
              />
              <OrderTable
                orders={inProgressOrders}
                onSeeOrderDetails={(orderId) =>
                  navigate(`/dashboard/orders/${orderId}/details`)
                }
                onCancelOrder={setPendingOrderCancelRequest}
              />
              <WarningConfirmDialog
                open={pendingOrderCancelRequest !== null}
                onClose={() => {
                  setPendingOrderCancelRequest(null);
                }}
                onConfirm={() => {
                  data.dispatch({
                    type: "ORDERS:CANCEL",
                    payload: pendingOrderCancelRequest!,
                  });
                  setPendingOrderCancelRequest(null);
                }}
                message="از لغو کردن این سفارش مطمئن هستید؟"
                confirmButtonText="لغو کردن"
              />
            </SectionContent>
          </div>
        </div>
      </div>
    </>
  );
}
