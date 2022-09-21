import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, NavLink, useNavigate } from "react-router-dom";
import PrintPrices from "../../../../components/PrintPrices";
import Switch from "../../../../components/Switch";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import Avatar from "../../../../components/Dashboard/Avatar";
import Wallet from "../../../../components/Dashboard/Wallet";
import InProgressOrderTable from "../../../../components/Dashboard/InProgressOrderTable";
import { ReactComponent as NavigateBeforeIcon } from "../../../../assets/icons/navigateBefore.svg";
import { ReactComponent as OrdersIcon } from "../../../../assets/icons/orders.svg";
import { ReactComponent as AddressesIcon } from "../../../../assets/icons/addresses.svg";
import { ReactComponent as TransactionsIcon } from "../../../../assets/icons/transactions.svg";
import { ReactComponent as MarketingIcon } from "../../../../assets/icons/marketing.svg";
import { ReactComponent as ProfileIcon } from "../../../../assets/icons/profile.svg";
import { ReactComponent as LogoutIcon } from "../../../../assets/icons/logout.svg";
import { ReactComponent as Logo } from "../../../../assets/images/logo.svg";
import { ReactComponent as PrintingImage } from "../../../../assets/images/printing.svg";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { PrintPaperSize } from "../../../../types";

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
        <div className={styles.Top}>
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
        <NavLink to="/dashboard/orders" className={styles.NavLink}>
          <OrdersIcon />
          <div className={styles.Text}>سفارش ها</div>
          <div className={styles.Arrow}>
            <NavigateBeforeIcon />
          </div>
        </NavLink>
        <NavLink to="/dashboard/addresses" className={styles.NavLink}>
          <AddressesIcon />
          <div className={styles.Text}>آدرس ها</div>
          <div className={styles.Arrow}>
            <NavigateBeforeIcon />
          </div>
        </NavLink>
        <NavLink to="/dashboard/transactions" className={styles.NavLink}>
          <TransactionsIcon />
          <div className={styles.Text}>تراکنش ها</div>
          <div className={styles.Arrow}>
            <NavigateBeforeIcon />
          </div>
        </NavLink>
        <NavLink to="/dashboard/marketing" className={styles.NavLink}>
          <MarketingIcon />
          <div className={styles.Text}>بازاریابی</div>
          <div className={styles.Arrow}>
            <NavigateBeforeIcon />
          </div>
        </NavLink>
        <div className={styles.Spacer} />
        <div className={styles.Bottom}>
          <NavLink to="/dashboard/profile" className={styles.NavLink}>
            <ProfileIcon />
            <div className={styles.Text}>پروفایل</div>
            <div className={styles.Arrow}>
              <NavigateBeforeIcon />
            </div>
          </NavLink>
          <div className={styles.NavLink}>
            <LogoutIcon />
            خروج
          </div>
        </div>
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
