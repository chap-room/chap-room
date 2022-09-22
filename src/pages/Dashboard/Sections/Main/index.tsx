import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { PrintPaperSize } from "../../../../types";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as Logo } from "../../../../assets/images/logo.svg";
import { ReactComponent as PrintingImage } from "../../../../assets/images/printing.svg";
import Avatar from "../../../../components/Dashboard/Avatar";
import Wallet from "../../../../components/Dashboard/Wallet";
import DashboardNavLinks from "../../../../components/Dashboard/NavLinks";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import PrintPrices from "../../../../components/PrintPrices";
import Button from "../../../../components/Button";
import Switch from "../../../../components/Switch";
import InProgressOrderTable from "../../../../components/Dashboard/InProgressOrderTable";

export default function DashboardMain() {
  const data = useContext(DashboardDataContext);

  const [pricesPrintPaperSize, setPricesPrintPaperSize] = useState(
    PrintPaperSize.a4
  );

  const navigate = useNavigate();

  return (
    <div className={styles.Container}>
      <Helmet title="داشبورد" />
      <div className={styles.Mobile}>
        <div className={styles.User}>
          <Avatar />
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
        <div className={styles.TitleContainer}>
          <p className={styles.Title}>داشبورد</p>
          <Link to="/" className={styles.BackToSiteButton}>
            بازگشت به سایت
            <Logo width={24} height={24} />
          </Link>
        </div>
        <div className={styles.ContentContainer}>
          <div>
            <div>
              <div className={styles.WelcomeUser}>
                سلام {data.state.currentUser.name}
              </div>
              <div className={styles.DashboardDescription}>
                خلاصه‌ای از همه چیز را ببینید
              </div>
              <div className={styles.Printing}>
                <PrintingImage />
              </div>
            </div>
            <div>
              <ContentHeader
                title="هزینه ها"
                end={
                  <div className={styles.PricesPrintPaperSizeButtons}>
                    <button
                      onClick={() => setPricesPrintPaperSize(PrintPaperSize.a4)}
                      className={
                        pricesPrintPaperSize === PrintPaperSize.a4
                          ? styles.Current
                          : undefined
                      }
                    >
                      {PrintPaperSize.a4}
                    </button>
                    <button
                      onClick={() => setPricesPrintPaperSize(PrintPaperSize.a3)}
                      className={
                        pricesPrintPaperSize === PrintPaperSize.a3
                          ? styles.Current
                          : undefined
                      }
                    >
                      {PrintPaperSize.a3}
                    </button>
                    <button
                      onClick={() => setPricesPrintPaperSize(PrintPaperSize.a5)}
                      className={
                        pricesPrintPaperSize === PrintPaperSize.a5
                          ? styles.Current
                          : undefined
                      }
                    >
                      {PrintPaperSize.a5}
                    </button>
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
            </div>
          </div>
          <div>
            <ContentHeader
              title="سفارش های در حال انجام"
              end={
                <Button onClick={() => navigate("/dashboard/orders/new")}>
                  سفارش جدید
                </Button>
              }
            />
            <InProgressOrderTable
              orders={data.state.orders}
              onSeeOrderDetails={(orderId) =>
                navigate(`/dashboard/orders/details/${orderId}`)
              }
              onCancelOrder={(orderId) =>
                navigate(`/dashboard/orders/details/${orderId}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
