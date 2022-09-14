import styles from "./style.module.scss";
import Button from "../../Button";
import Dialog from "../../Dialog";
import { ReactComponent as WarningIcon } from "../../../assets/icons/warning.svg";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message: string;
}

export default function ConfirmDeleteDialog({
  open,
  onConfirm,
  onClose,
  message,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog title="برداشت موجودی" open={open} onClose={onClose}>
      <div className={styles.Container}>
        <div className={styles.WarningIcon}>
          <WarningIcon />
        </div>
        <div className={styles.Message}>{message}</div>
        <div className={styles.Buttons}>
          <Button varient="filled" onClick={onConfirm}>حذف</Button>
          <Button varient="outlined" onClick={onClose}>بستن</Button>
        </div>
      </div>
    </Dialog>
  );
}
