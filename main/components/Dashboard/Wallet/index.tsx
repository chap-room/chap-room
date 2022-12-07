import styles from "./style.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import { walletDeposit, walletWithdrawal } from "@/main/api";
import { formatNumber } from "@/shared/utils/format";
import { useDashboardData } from "@/main/context/dashboardData";
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
  console.log(dashboardData);

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
            {formatNumber(
              (dashboardData.data?.walletBalance || 0) +
                (dashboardData.data?.marketingBalance || 0)
            )}
          </span>{" "}
          <span>تومان</span>
        </div>
        <div className={styles.Spacer} />
        <ExpandMoreIcon className={styles.ExpandMoreIcon} />
      </div>
      <div className={styles.WalletDetails}>
        <div className={styles.WalletBalance}>
          <div>موجودی کیف پول:</div>
          <div>
            <span>{formatNumber(dashboardData.data?.walletBalance || 0)}</span>{" "}
            تومان
          </div>
        </div>
        <div className={styles.MarketingBalance}>
          <div>موجودی فروش بازاریابی:</div>
          <div>
            <span>
              {formatNumber(dashboardData.data?.marketingBalance || 0)}
            </span>{" "}
            تومان
          </div>
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
              dashboardData.loaderState.reload();
            })
            .catch(toast.error)
        }
      />
    </div>
  );
}
