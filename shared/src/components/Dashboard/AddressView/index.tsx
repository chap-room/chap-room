import styles from "./style.module.scss";
import { Address } from "@chap-room/shared/types";
import { ReactComponent as EditIcon } from "@chap-room/shared/assets/icons/edit.svg";
import { ReactComponent as DeletetIcon } from "@chap-room/shared/assets/icons/delete.svg";
import ButtonList from "@chap-room/shared/components/ButtonList";
import IconButton from "@chap-room/shared/components/IconButton";

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
    <div className={styles.AddressView} key={address.id}>
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
