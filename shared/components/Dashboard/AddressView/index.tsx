import styles from "./style.module.scss";
import { FormattedNumber } from "react-intl";
import { Address } from "@/shared/types";
import EditIcon from "@/shared/assets/icons/edit.svg";
import DeletetIcon from "@/shared/assets/icons/delete.svg";
import ButtonList from "@/shared/components/ButtonList";
import IconButton from "@/shared/components/IconButton";

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
      <div>
        <div>
          شماره تلفن:{" "}
          <FormattedNumber
            value={parseInt(address.recipientPhoneNumber)}
            useGrouping={false}
            minimumIntegerDigits={11}
          />
        </div>
        <div>
          کد پستی:{" "}
          <FormattedNumber
            value={parseInt(address.recipientPostalCode)}
            useGrouping={false}
            minimumIntegerDigits={10}
          />
        </div>
      </div>
      <div>
        نشانی: استان {address.recipientDeliveryProvince}، شهر{" "}
        {address.recipientDeliveryCity}، {address.recipientDeliveryAddress}
      </div>
    </div>
  );
}
