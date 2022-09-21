import styles from "./style.module.scss";
import Button from "../../Button";
import Dialog from "../../Dialog";
import ButtonList from "../../ButtonList";
import { ReactComponent as WarningIcon } from "../../../assets/icons/warning.svg";

interface WarningConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  message: string;
  confirmButtonText: string;
}

export default function WarningConfirmDialog({
  open,
  onConfirm,
  onClose,
  message,
  confirmButtonText,
}: WarningConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.Container}>
        <div className={styles.WarningIcon}>
          <WarningIcon />
        </div>
        <div className={styles.Message}>{message}</div>
        <div className={styles.Buttons}>
          <ButtonList>
            <Button className={styles.Button} onClick={onClose}>
              بستن
            </Button>
            <Button
              varient="filled"
              className={styles.Button}
              onClick={onConfirm}
            >
              {confirmButtonText}
            </Button>
          </ButtonList>
        </div>
      </div>
    </Dialog>
  );
}
