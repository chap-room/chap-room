import styles from "./style.module.scss";
import { useContext, useState } from "react";
import { DataContext } from "../../../dataContext";
import { ReactComponent as ExpandMoreIcon } from "../../../assets/svg/expandMore.svg";
import IncreasBalanceDialog from "../IncreasBalanceDialog";
import WithdrawBalanceDialog from "../WithdrawBalanceDialog";

export default function Wallet() {
  const data = useContext(DataContext);

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
        موجودی: 1222000 تومان
        <div className={styles.Spacer} />
        <ExpandMoreIcon className={styles.ExpandMoreIcon} />
      </div>
      <div className={styles.WalletDetails}>
        <div>
          موجودی کیف پول:
          <div className={styles.Spacer} />
          152000 تومان
        </div>
        <div>
          موجودی فروش بازاریابی:
          <div className={styles.Spacer} />
          182000 تومان
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
      />
      <WithdrawBalanceDialog
        open={showWithdrawBalanceDialog}
        onClose={() => setShowWithdrawBalanceDialog(false)}
      />
    </div>
  );
}
