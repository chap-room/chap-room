import styles from "./style.module.scss";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Head from "next/head";
import { Order, PrintSize } from "@/shared/types";
import { cancelOrder, getDashboard } from "@/main/api";
import AddIcon from "@/shared/assets/icons/add.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import DataLoader from "@/shared/components/Dashboard/DataLoader";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import PrintPrices from "@/main/components/PrintPrices";
import Button from "@/shared/components/Button";
import Switch from "@/shared/components/Switch";
import OrderTable from "@/main/components/Dashboard/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import PrintingImage from "@/shared/assets/images/printing.svg";
import Avatar from "@/shared/components/Dashboard/Avatar";
import Wallet from "@/main/components/Dashboard/Wallet";
import DashboardNavLinks from "@/main/components/Dashboard/NavLinks";

export default function DashboardMain() {
  const router = useRouter();

  const [data, setData] = useState<{
    marketingBalance: number;
    walletBalance: number;
    avatar: string | null;
    name: string;
    phoneNumber: string;
    inProgressOrders: Order[];
  }>({
    marketingBalance: 0,
    walletBalance: 0,
    avatar: null,
    name: "",
    phoneNumber: "",
    inProgressOrders: [],
  });

  const [pricesPrintSize, setPricesPrintSize] = useState(PrintSize.a4);
  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.isDeposit === "true") {
        if (router.query.isSuccessful === "true") {
          // TODO Chnage message
          toast.success("افزایش موجودی با موفقیت انجام شده");
        } else {
          toast.error("افزایش موجودی با موفقیت انجام نشده");
        }
        router.replace("/dashboard");
      }
    }
  }, [router.isReady]);

  return (
    <div className={styles.Container}>
      <Head>
        <title>داشبورد</title>
      </Head>
      <SectionHeader title="داشبورد" />
      <DataLoader load={() => getDashboard()} setData={setData}>
        <div className={styles.NonMobile}>
          <div className={styles.ContentContainer}>
            <div>
              <SectionContent>
                <div className={styles.WelcomeUser}>سلام {data.name}</div>
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
                    <div className={styles.PricesPrintSizeButtons}>
                      <SwitchButtons
                        options={[
                          {
                            id: PrintSize.a4,
                            label: PrintSize.a4,
                          },
                          {
                            id: PrintSize.a5,
                            label: PrintSize.a5,
                          },
                          {
                            id: PrintSize.a3,
                            label: PrintSize.a3,
                          },
                        ]}
                        value={pricesPrintSize}
                        onChange={(newValue) =>
                          setPricesPrintSize(newValue as PrintSize)
                        }
                      />
                    </div>
                  }
                />
                <Switch
                  currentViewId={pricesPrintSize}
                  views={[
                    {
                      id: PrintSize.a4,
                      content: <PrintPrices />,
                    },
                    {
                      id: PrintSize.a5,
                      content: <PrintPrices />,
                    },
                    {
                      id: PrintSize.a3,
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
                    onClick={() => router.push("/dashboard/orders/new")}
                  >
                    سفارش جدید <AddIcon />
                  </Button>
                }
              />
              <OrderTable
                orders={data.inProgressOrders}
                onSeeOrderDetails={(orderId) =>
                  router.push(`/dashboard/orders/${orderId}/details`)
                }
                onCancelOrder={setPendingOrderCancelRequest}
              />
              {!data.inProgressOrders.length && (
                <EmptyNote>شما هیچ سفارشی در حال انجام ندارید</EmptyNote>
              )}
              <WarningConfirmDialog
                open={pendingOrderCancelRequest !== null}
                onClose={() => {
                  setPendingOrderCancelRequest(null);
                }}
                onConfirm={() =>
                  cancelOrder(pendingOrderCancelRequest!)
                    .then((message) => {
                      toast.success(message);
                      setPendingOrderCancelRequest(null);
                    })
                    .catch(toast.error)
                }
                message="از لغو کردن این سفارش مطمئن هستید؟"
                confirmButtonText="لغو کردن"
              />
            </SectionContent>
          </div>
        </div>
        <div className={styles.Mobile}>
          <div className={styles.User}>
            <Avatar user={data} />
            <div className={styles.Meta}>
              <div className={styles.PhoneNumber}>{data.phoneNumber}</div>
              <div className={styles.Name}>{data.name}</div>
            </div>
          </div>
          <div className={styles.Welcome}>!خوش‌آمدی</div>
          <Wallet
            marketingBalance={data.marketingBalance}
            walletBalance={data.walletBalance}
          />
          <DashboardNavLinks />
        </div>
      </DataLoader>
    </div>
  );
}

DashboardMain.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
