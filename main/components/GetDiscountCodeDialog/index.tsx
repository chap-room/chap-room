import styles from "./style.module.scss";
import Dialog from "@/shared/components/Dialog";
import CopyableText from "@/shared/components/CopyableText";

interface GetDiscountCodeDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function GetDiscountCodeDialog({
  open,
  onClose,
}: GetDiscountCodeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullScreenInMobile title="دریافت کد هدیه">
      <div className={styles.DialogContent}>
        <div>کد تخفیف:</div>
        <CopyableText text="free30">
          <div style={{ color: "#7d00ff" }}>free30</div>
        </CopyableText>
      </div>
    </Dialog>
  );
}
