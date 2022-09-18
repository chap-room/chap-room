import { Address } from "../../../types";
import styles from "./style.module.scss";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { ReactComponent as DeletetIcon } from "../../../assets/icons/delete.svg";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { useState } from "react";
import ButtonList from "../../ButtonList";

interface AddressListProps {
  addresses: Address[];
  onEditAddress: (addressId: string) => void;
  onDeleteAddress: (addressId: string) => void;
}

export default function AddressList({
  addresses,
  onEditAddress,
  onDeleteAddress,
}: AddressListProps) {
  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    string | null
  >(null);

  return (
    <>
      <div className={styles.AddressList}>
        {addresses.map((address) => (
          <div className={styles.Address} key={address.id}>
            <div className={styles.Header}>
              <div className={styles.Label}>{address.label}</div>
              <div className={styles.Spacer} />
              <ButtonList gap={5}>
                <button
                  className={styles.EditButton}
                  onClick={() => onEditAddress(address.id)}
                >
                  <EditIcon />
                </button>
                <button
                  className={styles.DeleteButton}
                  onClick={() => setPendingDeleteRequest(address.id)}
                >
                  <DeletetIcon />
                </button>
              </ButtonList>
            </div>
            <div>نام گیرنده: {address.recipientName}</div>
            <div>شماره تلفن: {address.recipientPhoneNumber}</div>
            <div>کد پستی: {address.recipientPostalCode}</div>
            <div>نشانی: {address.recipientDeliveryAddress}</div>
          </div>
        ))}
      </div>
      <ConfirmDeleteDialog
        open={pendingDeleteRequest !== null}
        onClose={() => {
          setPendingDeleteRequest(null);
        }}
        onConfirm={() => {
          onDeleteAddress(pendingDeleteRequest || '');
          setPendingDeleteRequest(null);
        }}
        message="از حذف این آدرس مطمئن هستید؟"
      />
    </>
  );
}
