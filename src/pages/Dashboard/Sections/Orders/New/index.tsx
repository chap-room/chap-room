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

enum NewOrderStages {
  folders = "پوشه ها",
  address = "آدرس پستی",
  payment = "پرداخت",
}

export default function DashboardNewOrder() {
  const [currentStage, setCurrentStage] = useState(NewOrderStages.folders);

  const progress = {
    [NewOrderStages.folders]: 1,
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
                {/* <PrintFolderList /> */}
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
