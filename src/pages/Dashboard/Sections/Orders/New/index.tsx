import styles from "./style.module.scss";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { useState } from "react";
import { FormattedNumber } from "react-intl";
import { ReactComponent as ArrowBackIcon } from "../../../../../assets/icons/arrowBack.svg";
import Switch from "../../../../../components/Switch";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";
import Button from "../../../../../components/Button";
import BottomActions from "../../../../../components/Dashboard/BottomActions";
import PrintFolderList from "../../../../../components/Dashboard/PrintFolderList";
import { PrintFolder } from "../../../../../types";
import AreaButton from "../../../../../components/Dashboard/AreaButton";
import CheckBox from "../../../../../components/CheckBox";
import Radio from "../../../../../components/Radio";

enum NewOrderStages {
  folders = "پوشه ها",
  newFolder = "پوشه جدید",
  address = "آدرس پستی",
  payment = "پرداخت",
}

export default function DashboardNewOrder() {
  const [currentStage, setCurrentStage] = useState(NewOrderStages.folders);
  const [printFolders, setPrintFolders] = useState<PrintFolder[]>([]);
  const [useWallet, setUseWallet] = useState(false);

  const progress = {
    [NewOrderStages.folders]: 1,
    [NewOrderStages.newFolder]: 1,
    [NewOrderStages.address]: 2,
    [NewOrderStages.payment]: 3,
  }[currentStage];

  const navigate = useNavigate();

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
            id: NewOrderStages.folders,
            content: (
              <>
                <PrintFolderList
                  printFolders={printFolders}
                  onDeletePrintFolder={() => {}}
                  onEditPrintFolder={() => {}}
                />
                <AreaButton
                  title="افزودن پوشه +"
                  description="در هر پوشه فایلهایی که مشخصات چاپ یکسانی دارند را آپلود کنید"
                  onClick={() => setCurrentStage(NewOrderStages.newFolder)}
                />
                <BottomActions>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.address)}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: NewOrderStages.newFolder,
            content: (
              <>
                <BottomActions>
                  <Button
                    onClick={() => setCurrentStage(NewOrderStages.folders)}
                  >
                    بازگشت
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.address)}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: NewOrderStages.address,
            content: (
              <>
                <BottomActions>
                  <Button
                    onClick={() => setCurrentStage(NewOrderStages.folders)}
                  >
                    مرحله قبل
                  </Button>
                  <Button
                    varient="filled"
                    style={{ minWidth: 150 }}
                    onClick={() => setCurrentStage(NewOrderStages.payment)}
                  >
                    مرحله بعد
                  </Button>
                </BottomActions>
              </>
            ),
          },
          {
            id: NewOrderStages.payment,
            content: (
              <>
                <div className={styles.Payment}>
                  <div></div>
                  <div className={styles.PaymentMethod}>
                    <div className={styles.Title}>شیوه پرداخت</div>
                    <div className={styles.List}>
                      <Radio
                        name="PaymentMethod"
                        checked={true}
                        onChange={() => {}}
                      />
                      <CheckBox checked={useWallet} onChange={setUseWallet} />
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
