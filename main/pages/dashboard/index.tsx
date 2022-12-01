import styles from "./style.module.scss";
import { ReactElement, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Head from "next/head";
import { cancelOrder } from "@/main/api";
import { englishToPersianNumbers } from "@/shared/utils/numbers";
import { DashboardData, useDashboardData } from "@/main/context/dashboardData";
import { DataLoaderView } from "@/shared/components/DataLoader";
import OrdersIcon from "@/shared/assets/icons/orders.svg";
import DashboardLayout from "@/main/components/Dashboard/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import FilledIconContainer from "@/shared/components/FilledIconContainer";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Switch from "@/shared/components/Switch";
import TariffsTable from "@/main/components/TariffsTable";
import Button from "@/shared/components/Button";
import OrderTable from "@/main/components/Dashboard/OrderTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import PrintingImage from "@/shared/assets/images/printing.svg";
import Avatar from "@/shared/components/Dashboard/Avatar";
import Wallet from "@/main/components/Dashboard/Wallet";
import DashboardNavLinks from "@/main/components/Dashboard/NavLinks";
import BottomButtons from "@/main/components/BottomButtons";

export default function DashboardMain() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      if (router.query.isDeposit === "true") {
        if (router.query.isSuccessful === "true") {
          // TODO Chnage message
          toast.success("افزایش موجودی با موفقیت انجام شده");
        } else {
          toast.error("متاسفانه پرداخت اخیر شما انجام نشد");
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
      <DataLoaderView state={dashboardData.dataLoaderState}>
        <DashboardNonMobile
          data={dashboardData.data!}
          relaod={() => {
            dashboardData.dataLoaderState.reload();
          }}
        />
        <DashboardMobile data={dashboardData.data!} />
      </DataLoaderView>
    </div>
  );
}

DashboardMain.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

interface DashboardNonMobilePorps {
  data: DashboardData;
  relaod: () => void;
}

export function DashboardNonMobile({ data, relaod }: DashboardNonMobilePorps) {
  const router = useRouter();

  const [tariffsTableSection, setTariffsTableSection] = useState<
    "a4" | "a5" | "a3" | "binding"
  >("a4");
  const [pendingOrderCancelRequest, setPendingOrderCancelRequest] = useState<
    number | null
  >(null);

  return (
    <div className={styles.NonMobile}>
      <div className={styles.ContentContainer}>
        <div>
          <SectionContent>
            <div className={styles.WelcomeUser}>سلام {data?.name}</div>
            <div className={styles.DashboardDescription}>
              خلاصه‌ای از همه چیز را ببینید در
              <br />
              چاپ روم
            </div>
            <div className={styles.Printing}>
              <PrintingImage />
            </div>
          </SectionContent>
          <SectionContent>
            <ContentHeader
              title="تعرفه ها"
              end={
                <div className={styles.PricesPrintSizeButtons}>
                  <SwitchButtons
                    options={[
                      {
                        id: "a4",
                        label: "A4",
                      },
                      {
                        id: "a5",
                        label: "A5",
                      },
                      {
                        id: "a3",
                        label: "A3",
                      },
                      {
                        id: "binding",
                        label: "صحافی",
                      },
                    ]}
                    value={tariffsTableSection}
                    onChange={setTariffsTableSection}
                  />
                </div>
              }
            />
            <Switch
              currentViewId={tariffsTableSection}
              views={[
                {
                  id: "a4",
                  content: (
                    <TariffsTable tariffs={data!.tariffs} section="a4" />
                  ),
                },
                {
                  id: "a5",
                  content: (
                    <TariffsTable tariffs={data!.tariffs} section="a5" />
                  ),
                },
                {
                  id: "a3",
                  content: (
                    <TariffsTable tariffs={data!.tariffs} section="a3" />
                  ),
                },
                {
                  id: "binding",
                  content: (
                    <TariffsTable tariffs={data!.tariffs} section="binding" />
                  ),
                },
              ]}
            />
          </SectionContent>
        </div>
        <SectionContent>
          <ContentHeader
            title="سفارش های در حال انجام من"
            end={
              <Button
                varient="content-title-none"
                onClick={() => router.push("/dashboard/orders/new")}
              >
                سفارش جدید
                <FilledIconContainer style={{ marginRight: 10 }}>
                  <OrdersIcon />
                </FilledIconContainer>
              </Button>
            }
          />
          <OrderTable
            orders={data!.inProgressOrders}
            onSeeOrderDetails={(orderId) =>
              router.push(
                `/dashboard/orders/${orderId}/details?fromDashboard=true`
              )
            }
            onCancelOrder={setPendingOrderCancelRequest}
          />
          {!data!.inProgressOrders.length && (
            <EmptyNote>هیچ سفارشی در حال انجام وجود ندارد</EmptyNote>
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
                  relaod();
                })
                .catch(toast.error)
            }
            message="از لغو کردن این سفارش مطمئن هستید؟"
            confirmButtonText="لغو کردن"
          />
        </SectionContent>
      </div>
    </div>
  );
}

interface DashboardMobilePorps {
  data: DashboardData;
}

export function DashboardMobile({ data }: DashboardMobilePorps) {
  return (
    <div className={styles.Mobile}>
      <div className={styles.User}>
        <Avatar user={data!} />
        <div className={styles.Meta}>
          <div className={styles.PhoneNumber}>
            {englishToPersianNumbers(data!.phoneNumber)}
          </div>
          <div className={styles.Name}>{data!.name}</div>
        </div>
      </div>
      <div className={styles.Welcome}>خوش‌آمدی!</div>
      <Wallet />
      <DashboardNavLinks />
      <div className={styles.BottomButtonsPlaceholder}>
        <BottomButtons />
      </div>
    </div>
  );
}
