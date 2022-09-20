import styles from "./style.module.scss";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { useContext, useState } from "react";
import { FormattedNumber } from "react-intl";
import { ReactComponent as ZarinpalLogo } from "../../../../../assets/images/zarinpal.svg";
import { ReactComponent as ArrowBackIcon } from "../../../../../assets/icons/arrowBack.svg";
import { DashboardDataContext } from "../../../../../context/DashboardData";
import Switch from "../../../../../components/Switch";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";
import Button from "../../../../../components/Button";
import BottomActions from "../../../../../components/Dashboard/BottomActions";
import PrintFolderList from "../../../../../components/Dashboard/PrintFolderList";
import { Address, PrintFolder } from "../../../../../types";
import AreaButton from "../../../../../components/Dashboard/AreaButton";
import CheckBox from "../../../../../components/CheckBox";
import Radio from "../../../../../components/Radio";
import AddressView from "../../../../../components/Dashboard/AddressView";
import PrintFolderForm from "../../../../../components/Dashboard/PrintFolderForm";
import ConfirmDeleteDialog from "../../../../../components/Dashboard/ConfirmDeleteDialog";
import AddressForm from "../../../../../components/Dashboard/AddressForm";

enum NewOrderStages {
  printFolders = "پوشه ها",
  newPrintFolder = "پوشه جدید",
  editPrintFolder = "ویرایش پوشه",
  address = "آدرس پستی",
  newAddress = "آدرس جدید",
  editAddress = "ویرایش آدرس",
  payment = "پرداخت",
}

export default function DashboardNewOrder() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [currentStage, setCurrentStage] = useState(NewOrderStages.printFolders);
  const [printFolders, setPrintFolders] = useState<PrintFolder[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    data.state.addresses[0]?.id
  );
  const [useWallet, setUseWallet] = useState(false);

  const progress = {
    [NewOrderStages.printFolders]: 1,
    [NewOrderStages.newPrintFolder]: 1,
    [NewOrderStages.editPrintFolder]: 1,
    [NewOrderStages.address]: 2,
    [NewOrderStages.newAddress]: 2,
    [NewOrderStages.editAddress]: 2,
    [NewOrderStages.payment]: 3,
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
      <Helmet title="داشبورد - سفارش جدید" />
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
            id: NewOrderStages.printFolders,
            content: (
              <>
                <div className={styles.PrintFolder}>
                  <PrintFolderList
                    printFolders={printFolders}
                    onEditPrintFolder={(index) => {
                      setCurrentInEditPrintFolder(printFolders[index]);
                      setCurrentStage(NewOrderStages.editPrintFolder);
                    }}
                    onDeletePrintFolder={setPendingPrintFolderDeleteRequest}
                  />
                  <ConfirmDeleteDialog
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
                  />
                  <AreaButton
                    title="افزودن پوشه +"
                    description="در هر پوشه فایلهایی که مشخصات چاپ یکسانی دارند را آپلود کنید"
                    onClick={() =>
                      setCurrentStage(NewOrderStages.newPrintFolder)
                    }
                  />
                </div>
                <BottomActions>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.address)}
                    disabled={printFolders.length === 0}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: NewOrderStages.newPrintFolder,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === NewOrderStages.newPrintFolder ? (
                <PrintFolderForm
                  onCancel={() => setCurrentStage(NewOrderStages.printFolders)}
                  onFinish={(printFolder) => {
                    setPrintFolders([...printFolders, printFolder]);
                    setCurrentStage(NewOrderStages.printFolders);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: NewOrderStages.editPrintFolder,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === NewOrderStages.editPrintFolder ? (
                <PrintFolderForm
                  defaultValues={currentInEditPrintFolder!}
                  onCancel={() => {
                    setCurrentInEditPrintFolder(null);
                    setCurrentStage(NewOrderStages.printFolders);
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
                    setCurrentStage(NewOrderStages.printFolders);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: NewOrderStages.address,
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
                          setCurrentStage(NewOrderStages.editAddress);
                        }}
                        onDelete={() =>
                          setPendingAddressDeleteRequest(address.id)
                        }
                      />
                    </div>
                  ))}
                </div>
                <ConfirmDeleteDialog
                  open={pendingAddressDeleteRequest !== null}
                  onClose={() => {
                    setPendingAddressDeleteRequest(null);
                  }}
                  onConfirm={() => {
                    data.dispatch({
                      type: "ADDRESSES:DELETE",
                      payload: pendingAddressDeleteRequest!,
                    });
                    setPendingAddressDeleteRequest(null);
                  }}
                  message="از حذف این آدرس مطمئن هستید؟"
                />
                <AreaButton
                  title="افزودن آدرس +"
                  onClick={() => setCurrentStage(NewOrderStages.newAddress)}
                />
                <BottomActions>
                  <Button
                    onClick={() => setCurrentStage(NewOrderStages.printFolders)}
                  >
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.payment)}
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
            id: NewOrderStages.newAddress,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === NewOrderStages.newAddress ? (
                <AddressForm
                  onCancel={() => setCurrentStage(NewOrderStages.address)}
                  onSave={(addressData) => {
                    data.dispatch({
                      type: "ADDRESSES:PUSH",
                      payload: {
                        id: uuidv4(),
                        ...addressData,
                      },
                    });
                    setCurrentStage(NewOrderStages.address);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: NewOrderStages.editAddress,
            // Unmount when currently not displayed to reset default state
            content:
              currentStage === NewOrderStages.editAddress ? (
                <AddressForm
                  defaultValues={currentInEditAddress!}
                  onCancel={() => {
                    setCurrentInEditAddress(null);
                    setCurrentStage(NewOrderStages.address);
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
                    setCurrentStage(NewOrderStages.address);
                  }}
                />
              ) : (
                <></>
              ),
          },
          {
            id: NewOrderStages.payment,
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
                    onClick={() => setCurrentStage(NewOrderStages.address)}
                  >
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.address)}
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
