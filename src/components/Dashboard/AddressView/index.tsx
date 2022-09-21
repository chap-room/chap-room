import styles from "./style.module.scss";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as DeletetIcon } from "../../../assets/icons/delete.svg";
import { Address } from "../../../types";
import ButtonList from "../../ButtonList";
import IconButton from "../../IconButton";

interface AddressViewProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AddressView({
  address,
  onEdit,
  onDelete,
}: AddressViewProps) {
  return (
    <div className={styles.Address} key={address.id}>
      <div className={styles.Header}>
        <div className={styles.Label}>{address.label}</div>
        <ButtonList gap={5}>
          <div className={styles.EditButton}>
            <IconButton varient="none" size={34} onClick={() => onEdit()}>
              <EditIcon />
            </IconButton>
          </div>
          <div className={styles.DeleteButton}>
            <IconButton varient="none" size={34} onClick={() => onDelete()}>
              <DeletetIcon />
            </IconButton>
          </div>
        </ButtonList>
      </div>
      <div>نام گیرنده: {address.recipientName}</div>
      <div>شماره تلفن: {address.recipientPhoneNumber}</div>
      <div>کد پستی: {address.recipientPostalCode}</div>
      <div>نشانی: {address.recipientDeliveryAddress}</div>
    </div>
  );
}
