import styles from "./style.module.scss";
import { Address } from "../../../types";
import AddressView from "../AddressView";

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
  return (
    <div className={styles.AddressList}>
      {addresses.map((address) => (
        <AddressView
          address={address}
          key={address.id}
          onEdit={() => onEditAddress(address.id)}
          onDelete={() => onDeleteAddress(address.id)}
        />
      ))}
    </div>
  );
}
