import styles from "./style.module.scss";
import Button from "../../Button";
import Dialog from "../../Dialog";
import ButtonList from "../../ButtonList";
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
    <Dialog open={open} onClose={onClose}>
      <div className={styles.Container}>
        <div className={styles.WarningIcon}>
          <WarningIcon />
        </div>
        <div className={styles.Message}>{message}</div>
        <ButtonList>
          <Button style={{ minWidth: 150 }} onClick={onClose}>
            بستن
          </Button>
          <Button
            varient="filled"
            style={{ minWidth: 150 }}
            onClick={onConfirm}
          >
            حذف
          </Button>
        </ButtonList>
      </div>
    </Dialog>
  );
}
