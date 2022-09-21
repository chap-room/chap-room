import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { FormattedNumber } from "react-intl";
import { PrintFolder, Address } from "../../../types";
import { DashboardDataContext } from "../../../context/DashboardData";
import { ReactComponent as ZarinpalLogo } from "../../../assets/images/zarinpal.svg";
import { ReactComponent as ArrowBackIcon } from "../../../assets/icons/arrowBack.svg";
import Switch from "../../Switch";
import ContentHeader from "../ContentHeader";
import BottomActions from "../BottomActions";
import Button from "../../Button";
import AreaButton from "../AreaButton";
import WarningConfirmDialog from "../WarningConfirmDialog";
import PrintFolderList from "../PrintFolderList";
import PrintFolderForm from "../PrintFolderForm";
import AddressView from "../AddressView";
import AddressForm from "../AddressForm";
import Radio from "../../Radio";
import CheckBox from "../../CheckBox";

enum OrderFormStages {
  printFolders = "پوشه ها",
  newPrintFolder = "پوشه جدید",
  editPrintFolder = "ویرایش پوشه",
  address = "آدرس پستی",
  newAddress = "آدرس جدید",
  editAddress = "ویرایش آدرس",
  payment = "پرداخت",
}

// interface OrderFormData {
//   printFolders: PrintFolder[];
//   addressId: string;
//   recipientPhoneNumber: string;
//   recipientPostalCode: string;
//   recipientDeliveryProvince: string;
//   recipientDeliveryCity: string;
//   recipientDeliveryAddress: string;
// }

interface OrderFormProps {
  // defaultValues?: OrderFormData;
  onCancel: () => void;
  onSave: (/* data: OrderFormData */) => void;
}

export default function OrderForm({
  // defaultValues,
  onCancel,
  onSave,
}: OrderFormProps) {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(
    OrderFormStages.printFolders
  );
  const [printFolders, setPrintFolders] = useState<PrintFolder[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    data.state.addresses[0]?.id
  );
  const [useWallet, setUseWallet] = useState(false);

  const progress = {
    [OrderFormStages.printFolders]: 1,
    [OrderFormStages.newPrintFolder]: 1,
    [OrderFormStages.editPrintFolder]: 1,
    [OrderFormStages.address]: 2,
    [OrderFormStages.newAddress]: 2,
    [OrderFormStages.editAddress]: 2,
    [OrderFormStages.payment]: 3,
  }[currentStage];

  const [pendingPrintFolderDeleteRequest, setPendingPrintFolderDeleteRequest] =
    useState<number | null>(null);
  const [currentInEditPrintFolder, setCurrentInEditPrintFolder] =
    useState<PrintFolder | null>(null);

  const [pendingAddressDeleteRequest, setPendingAddressDeleteRequest] =
    useState<string | null>(null);
  const [currentInEditAddress, setCurrentInEditAddress] =
    useState<Address | null>(null);

  return (
    <>
      <ContentHeader
        title={currentStage}
        start={
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
            <div className={styles.SemiCircleProgressBarText}>
              <FormattedNumber value={progress} />/<FormattedNumber value={3} />
            </div>
          </div>
        }
        end={
          <Button onClick={() => navigate("/dashboard/orders")}>
            انصراف و بازگشت <ArrowBackIcon />
          </Button>
        }
      />
      <Switch
        currentViewId={currentStage}
        views={[
          {
            id: OrderFormStages.printFolders,
            content: (
              <>
                <div className={styles.PrintFolder}>
                  <PrintFolderList
                    printFolders={printFolders}
                    onEditPrintFolder={(index) => {
                      setCurrentInEditPrintFolder(printFolders[index]);
                      setCurrentStage(OrderFormStages.editPrintFolder);
                    }}
                    onDeletePrintFolder={setPendingPrintFolderDeleteRequest}
                  />
                  <WarningConfirmDialog
                    open={pendingPrintFolderDeleteRequest !== null}
                    onClose={() => {
                      setPendingPrintFolderDeleteRequest(null);
                    }}
                    onConfirm={() => {
                      setPrintFolders(
                        printFolders.filter(
                          (_, index) =>
                            index !== pendingPrintFolderDeleteRequest
                        )
                      );
                      setPendingPrintFolderDeleteRequest(null);
                    }}
                    message="از حذف این پوشه مطمئن هستید؟"
                    confirmButtonText="حذف"
                  />
                  <AreaButton
                    title="افزودن پوشه +"
                    description="در هر پوشه فایلهایی که مشخصات چاپ یکسانی دارند را آپلود کنید"
                    onClick={() =>
                      setCurrentStage(OrderFormStages.newPrintFolder)
                    }
                  />
                </div>
                <BottomActions>
                  <Button onClick={() => onCancel()}>بازگشت</Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(OrderFormStages.address)}
                    disabled={printFolders.length === 0}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: OrderFormStages.newPrintFolder,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === OrderFormStages.newPrintFolder ? (
                <PrintFolderForm
                  onCancel={() => setCurrentStage(OrderFormStages.printFolders)}
                  onFinish={(printFolderData) => {
                    setPrintFolders([...printFolders, printFolderData]);
                    setCurrentStage(OrderFormStages.printFolders);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: OrderFormStages.editPrintFolder,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === OrderFormStages.editPrintFolder ? (
                <PrintFolderForm
                  defaultValues={currentInEditPrintFolder!}
                  onCancel={() => {
                    setCurrentInEditPrintFolder(null);
                    setCurrentStage(OrderFormStages.printFolders);
                  }}
                  onFinish={(printFolderData) => {
                    setPrintFolders(
                      printFolders.map((printFolder) =>
                        printFolder === currentInEditPrintFolder
                          ? printFolderData
                          : printFolder
                      )
                    );
                    setCurrentInEditPrintFolder(null);
                    setCurrentStage(OrderFormStages.printFolders);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: OrderFormStages.address,
            content: (
              <>
                <div className={styles.AddressSelect}>
                  {data.state.addresses.map((address) => (
                    <div key={address.id}>
                      <Radio
                        checked={address.id === selectedAddressId}
                        onChecked={() => setSelectedAddressId(address.id)}
                      />
                      <AddressView
                        address={address}
                        onEdit={() => {
                          setCurrentInEditAddress(address);
                          setCurrentStage(OrderFormStages.editAddress);
                        }}
                        onDelete={() =>
                          setPendingAddressDeleteRequest(address.id)
                        }
                      />
                    </div>
                  ))}
                </div>
                <WarningConfirmDialog
                  open={pendingAddressDeleteRequest !== null}
                  onClose={() => {
                    setPendingAddressDeleteRequest(null);
                  }}
                  onConfirm={() => {
                    if (pendingAddressDeleteRequest === selectedAddressId) {
                      if (selectedAddressId === data.state.addresses[0]?.id) {
                        setSelectedAddressId(data.state.addresses[1]?.id);
                      } else {
                        setSelectedAddressId(data.state.addresses[0]?.id);
                      }
                    }
                    data.dispatch({
                      type: "ADDRESSES:DELETE",
                      payload: pendingAddressDeleteRequest!,
                    });
                    setPendingAddressDeleteRequest(null);
                  }}
                  message="از حذف این آدرس مطمئن هستید؟"
                  confirmButtonText="حذف"
                />
                <AreaButton
                  title="افزودن آدرس +"
                  onClick={() => setCurrentStage(OrderFormStages.newAddress)}
                />
                <BottomActions>
                  <Button
                    onClick={() =>
                      setCurrentStage(OrderFormStages.printFolders)
                    }
                  >
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(OrderFormStages.payment)}
                    disabled={
                      !data.state.addresses
                        .map((item) => item.id)
                        .includes(selectedAddressId || "")
                    }
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: OrderFormStages.newAddress,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === OrderFormStages.newAddress ? (
                <AddressForm
                  onCancel={() => setCurrentStage(OrderFormStages.address)}
                  onSave={(addressData) => {
                    data.dispatch({
                      type: "ADDRESSES:PUSH",
                      payload: {
                        id: uuidv4(),
                        ...addressData,
                      },
                    });
                    setCurrentStage(OrderFormStages.address);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: OrderFormStages.editAddress,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === OrderFormStages.editAddress ? (
                <AddressForm
                  defaultValues={currentInEditAddress!}
                  onCancel={() => {
                    setCurrentInEditAddress(null);
                    setCurrentStage(OrderFormStages.address);
                  }}
                  onSave={(addressData) => {
                    data.dispatch({
                      type: "ADDRESSES:UPDATE",
                      payload: {
                        id: currentInEditAddress!.id,
                        ...addressData,
                      },
                    });
                    setCurrentInEditAddress(null);
                    setCurrentStage(OrderFormStages.address);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: OrderFormStages.payment,
            content: (
              <>
                <div className={styles.Payment}>
                  <div className={styles.OrderDetails}></div>
                  <div className={styles.PaymentMethod}>
                    <div className={styles.Title}>شیوه پرداخت</div>
                    <div className={styles.List}>
                      <div>
                        <div>
                          <Radio checked={true} onChecked={() => {}} />
                          درگاه پرداخت زرین پال
                        </div>
                        <div>
                          <ZarinpalLogo />
                        </div>
                      </div>
                      <div className={styles.Separator}></div>
                      <div>
                        <div>
                          <CheckBox
                            checked={useWallet}
                            onChange={setUseWallet}
                          />
                          کیف پول
                        </div>
                        <div>
                          موجودی:{" "}
                          <FormattedNumber value={data.state.wallet.balance} />{" "}
                          تومان
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <BottomActions>
                  <Button
                    onClick={() => setCurrentStage(OrderFormStages.address)}
                  >
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => onSave()}
                  >
                    پرداخت
                  </Button>
                </BottomActions>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
