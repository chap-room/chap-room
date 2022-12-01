import styles from "./style.module.scss";
import { useState } from "react";
import { FormattedNumber } from "react-intl";
import toast from "react-hot-toast";
import { walletDeposit, walletWithdrawal } from "@/main/api";
import { useDashboardData } from "@/main/context/dashboardData";
import { DataLoaderView } from "@/shared/components/DataLoader";
import ExpandMoreIcon from "@/shared/assets/icons/expandMore.svg";
import IncreasBalanceDialog from "@/main/components/Dashboard/IncreasBalanceDialog";
import WithdrawBalanceDialog from "@/main/components/Dashboard/WithdrawBalanceDialog";

export default function Wallet() {
  const dashboardData = useDashboardData();
  const [walletExpanded, setWalletExpanded] = useState(false);
  const [showIncreasBalanceDialog, setShowIncreasBalanceDialog] =
    useState(false);
  const [showWithdrawBalanceDialog, setShowWithdrawBalanceDialog] =
    useState(false);

  return (
    <div
      className={
        walletExpanded
          ? styles.Wallet + " " + styles.WalletExpanded
          : styles.Wallet
      }
    >
      <div
        className={styles.WalletOverview}
        onClick={() => {
          setWalletExpanded(!walletExpanded);
        }}
      >
        <div className={styles.Balance}>
          موجودی:{" "}
          <span>
            <DataLoaderView
              state={dashboardData.walletDataLoaderState}
              size="small"
            >
              <FormattedNumber
                value={
                  (dashboardData.data?.walletBalance || 0) +
                  (dashboardData.data?.marketingBalance || 0)
                }
              />
            </DataLoaderView>
          </span>{" "}
          <span>تومان</span>
        </div>
        <div className={styles.Spacer} />
        <ExpandMoreIcon className={styles.ExpandMoreIcon} />
      </div>
      <div className={styles.WalletDetails}>
        <div>
          موجودی کیف پول:
          <div className={styles.Spacer} />
          <span>
            <DataLoaderView
              state={dashboardData.walletDataLoaderState}
              size="small"
            >
              <FormattedNumber value={dashboardData.data?.walletBalance || 0} />
            </DataLoaderView>
          </span>{" "}
          تومان
        </div>
        <div>
          موجودی فروش بازاریابی:
          <div className={styles.Spacer} />
          <span>
            <DataLoaderView
              state={dashboardData.walletDataLoaderState}
              size="small"
            >
              <FormattedNumber
                value={dashboardData.data?.marketingBalance || 0}
              />
            </DataLoaderView>
          </span>{" "}
          تومان
        </div>
        <button
          className={styles.IncreasBalance}
          onClick={() => setShowIncreasBalanceDialog(true)}
        >
          افزایش موجودی
        </button>
        <button
          className={styles.WithdrawBalance}
          onClick={() => setShowWithdrawBalanceDialog(true)}
        >
          برداشت موجودی
        </button>
      </div>
      <IncreasBalanceDialog
        open={showIncreasBalanceDialog}
        onClose={() => setShowIncreasBalanceDialog(false)}
        onSubmit={(amount) =>
          walletDeposit(amount)
            .then((paymentUrl) => {
              window.location.href = paymentUrl;
            })
            .catch(toast.error)
        }
      />
      <WithdrawBalanceDialog
        open={showWithdrawBalanceDialog}
        onClose={() => setShowWithdrawBalanceDialog(false)}
        onSubmit={(accountHolderName, iban) =>
          walletWithdrawal(accountHolderName, iban)
            .then((message) => {
              toast.success(message);
              setShowWithdrawBalanceDialog(false);
              dashboardData.walletDataLoaderState.reload();
            })
            .catch(toast.error)
        }
      />
    </div>
  );
}
