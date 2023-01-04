import styles from "./style.module.scss";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Link from "next/link";
import { Address, PrintFolder } from "@/shared/types";
import { newOrder } from "@/main/api";
import { useDashboardData } from "@/main/context/dashboardData";
import ArrowBackIcon from "@/shared/assets/icons/arrowBack.svg";
import CloseIcon from "@/shared/assets/icons/close.svg";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import Button from "@/shared/components/Button";
import IconButton from "@/shared/components/IconButton";
import PrintFoldersStage from "@/main/components/Dashboard/OrderForm/PrintFoldersStage";
import NewPrintFolderStage from "@/main/components/Dashboard/OrderForm/NewPrintFolderStage";
import EditPrintFolderStage from "@/main/components/Dashboard/OrderForm/EditPrintFolderStage";
import AddressStage from "@/main/components/Dashboard/OrderForm/AddressStage";
import NewAddressesStage from "@/main/components/Dashboard/OrderForm/NewAddressesStage";
import EditAddressesStage from "@/main/components/Dashboard/OrderForm/EditAddressesStage";
import PaymentStage from "@/main/components/Dashboard/OrderForm/PaymentStage";

enum OrderFormStages {
  printFolders = "پوشه ها",
  newPrintFolder = "پوشه جدید",
  editPrintFolder = "ویرایش پوشه",
  address = "آدرس پستی",
  newAddress = "آدرس جدید",
  editAddress = "ویرایش آدرس",
  payment = "پرداخت",
}

export default function OrderForm() {
  const dashboardData = useDashboardData();
  const router = useRouter();

  const [currentStage, setCurrentStage] = useState(
    OrderFormStages.printFolders
  );

  const [printFoldersData, setPrintFoldersData] = useState<PrintFolder[]>([]);
  const [addressesData, setAddressesData] = useState<Address[]>([]);

  const [currentInEditPrintFolderId, setCurrentInEditPrintFolderId] = useState<
    number | null
  >(null);
  const [currentInEditAddressId, setCurrentInEditAddressId] = useState<
    number | null
  >(null);

  const [addressId, setAddressId] = useState<number | null>(null);

  const progress = {
    [OrderFormStages.printFolders]: 1,
    [OrderFormStages.newPrintFolder]: 1,
    [OrderFormStages.editPrintFolder]: 1,
    [OrderFormStages.address]: 2,
    [OrderFormStages.newAddress]: 2,
    [OrderFormStages.editAddress]: 2,
    [OrderFormStages.payment]: 3,
  }[currentStage];

  const SemiCircleProgressBar = (
    <div className={styles.SemiCircleProgressBar}>
      <CircularProgressbar
        value={progress}
        maxValue={3}
        counterClockwise
        circleRatio={0.75}
        classes={{
          root: "",
          background: "",
          path: styles.SemiCircleProgressBarPath,
          trail: styles.SemiCircleProgressBarTrail,
          text: "",
        }}
      />
      <div className={styles.SemiCircleProgressBarText}>{progress}/3</div>
    </div>
  );

  const isMainStage = [
    OrderFormStages.printFolders,
    OrderFormStages.address,
    OrderFormStages.payment,
  ].includes(currentStage);

  const printFolderIndex =
    currentStage === OrderFormStages.newPrintFolder
      ? printFoldersData.length + 1
      : currentStage === OrderFormStages.editPrintFolder
      ? (printFoldersData
          .map((item) => item.id)
          .indexOf(currentInEditPrintFolderId!) || 0) + 1
      : 1;

  const title = [
    OrderFormStages.newPrintFolder,
    OrderFormStages.editPrintFolder,
  ].includes(currentStage)
    ? `پوشه ${printFolderIndex}`
    : currentStage;

  return (
    <>
      <ContentHeader
        title={title}
        start={isMainStage && SemiCircleProgressBar}
        end={
          isMainStage ? (
            <Link href="/dashboard/orders">
              <Button varient="none" style={{ padding: 0 }}>
                انصراف و بازگشت <ArrowBackIcon />
              </Button>
            </Link>
          ) : (
            <Button
              varient="none"
              onClick={() => {
                setCurrentStage(
                  currentStage === OrderFormStages.newPrintFolder ||
                    currentStage === OrderFormStages.editPrintFolder
                    ? OrderFormStages.printFolders
                    : OrderFormStages.address
                );
                if (currentStage === OrderFormStages.editAddress) {
                  setCurrentInEditPrintFolderId(null);
                }
                if (currentStage === OrderFormStages.editAddress) {
                  setCurrentInEditAddressId(null);
                }
              }}
              style={{ padding: 0 }}
            >
              بازگشت <ArrowBackIcon />
            </Button>
          )
        }
      />
      <MobileContentHeader
        title={title}
        subTitle={
          currentStage === OrderFormStages.newPrintFolder ||
          currentStage === OrderFormStages.editPrintFolder
            ? printFolderIndex === 1
              ? "پوشه اول خود را سفارش دهید"
              : "پوشه خود را سفارش دهید"
            : currentStage === OrderFormStages.newAddress ||
              currentStage === OrderFormStages.editAddress
            ? "مشخصات گیرنده را وارد کنید"
            : undefined
        }
        start={
          isMainStage && (
            <div className={styles.MobileSemiCircleProgressBar}>
              {SemiCircleProgressBar}
            </div>
          )
        }
        end={
          isMainStage ? (
            <Link href="/dashboard/orders">
              <IconButton varient="outlined">
                <CloseIcon />
              </IconButton>
            </Link>
          ) : (
            <a
              onClick={() => {
                setCurrentStage(
                  currentStage === OrderFormStages.newPrintFolder ||
                    currentStage === OrderFormStages.editPrintFolder
                    ? OrderFormStages.printFolders
                    : OrderFormStages.address
                );
                if (currentStage === OrderFormStages.editAddress) {
                  setCurrentInEditPrintFolderId(null);
                }
                if (currentStage === OrderFormStages.editAddress) {
                  setCurrentInEditAddressId(null);
                }
              }}
            >
              <IconButton varient="outlined">
                <ArrowBackIcon />
              </IconButton>
            </a>
          )
        }
      />
      {currentStage === OrderFormStages.printFolders && (
        <PrintFoldersStage
          data={printFoldersData}
          setData={setPrintFoldersData}
          actions={{
            new: () => setCurrentStage(OrderFormStages.newPrintFolder),
            edit: (printFolderId) => {
              setCurrentInEditPrintFolderId(printFolderId);
              setCurrentStage(OrderFormStages.editPrintFolder);
            },
            finish: () => setCurrentStage(OrderFormStages.address),
          }}
        />
      )}
      {currentStage === OrderFormStages.newPrintFolder && (
        <NewPrintFolderStage
          index={printFolderIndex}
          actions={{
            finish: () => setCurrentStage(OrderFormStages.printFolders),
          }}
        />
      )}
      {currentStage === OrderFormStages.editPrintFolder && (
        <EditPrintFolderStage
          index={printFolderIndex}
          printFolderId={currentInEditPrintFolderId!}
          actions={{
            finish: () => {
              setCurrentInEditPrintFolderId(null);
              setCurrentStage(OrderFormStages.printFolders);
            },
          }}
        />
      )}
      {currentStage === OrderFormStages.address && (
        <AddressStage
          data={addressesData}
          setData={setAddressesData}
          selectedAddressId={addressId}
          setSelectedAddressId={setAddressId}
          actions={{
            back: () => setCurrentStage(OrderFormStages.printFolders),
            new: () => setCurrentStage(OrderFormStages.newAddress),
            edit: (addressId) => {
              setCurrentInEditAddressId(addressId);
              setCurrentStage(OrderFormStages.editAddress);
            },
            finish: () => setCurrentStage(OrderFormStages.payment),
          }}
        />
      )}
      {currentStage === OrderFormStages.newAddress && (
        <NewAddressesStage
          actions={{
            finish: () => setCurrentStage(OrderFormStages.address),
          }}
        />
      )}
      {currentStage === OrderFormStages.editAddress && (
        <EditAddressesStage
          addressId={currentInEditAddressId!}
          actions={{
            finish: () => {
              setCurrentInEditAddressId(null);
              setCurrentStage(OrderFormStages.address);
            },
          }}
        />
      )}
      {currentStage === OrderFormStages.payment && (
        <PaymentStage
          addressId={addressId!}
          actions={{
            back: () => setCurrentStage(OrderFormStages.address),
            finish: (discountCode, paidWithWallet) =>
              newOrder(addressId!, discountCode, paidWithWallet)
                .then(({ orderId, paymentUrl }) => {
                  if (orderId) {
                    router.push(
                      `/dashboard/orders/payment-result?isSuccessful=true&orderId=${orderId}`
                    );
                    if (paidWithWallet) {
                      dashboardData.loaderState.reload();
                    }
                  }
                  if (paymentUrl) window.location.href = paymentUrl;
                })
                .catch(toast.error),
          }}
        />
      )}
    </>
  );
}
