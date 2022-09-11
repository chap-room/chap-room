import { Address } from "../../../types";
import styles from "./style.module.scss";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as DeletetIcon } from "../../../assets/icons/delete.svg";

interface PrintFolderListProps {
  addresses: Address[];
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
}

export default function PrintFolderList({
  addresses,
  onEditAddress,
  onDeleteAddress,
}: PrintFolderListProps) {
  return (
    <div className={styles.AddressList}>
      {addresses.map((address) => (
        <div className={styles.Address} key={address.id}>
          <div className={styles.Header}>
            <div className={styles.Label}>{address.label}</div>
            <div className={styles.Spacer} />
            <div className={styles.Actions}>
              <button
                className={styles.EditButton}
                onClick={() => onEditAddress(address.id)}
              >
                <EditIcon />
              </button>
              <button
                className={styles.DeleteButton}
                onClick={() => onDeleteAddress(address.id)}
              >
                <DeletetIcon />
              </button>
            </div>
          </div>
          <div>نام گیرنده: {address.recipientName}</div>
          <div>شماره تلفن: {address.recipientPhoneNumber}</div>
          <div>کد پستی: {address.recipientPostalCode}</div>
          <div>نشانی: {address.recipientDeliveryAddress}</div>
        </div>
      ))}
    </div>
  );
}
