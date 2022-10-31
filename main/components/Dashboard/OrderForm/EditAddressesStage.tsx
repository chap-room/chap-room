import { useState } from "react";
import toast from "react-hot-toast";
import { Address } from "@/shared/types";
import { getAddress, updateAddress } from "@/main/api";
import DataLoader from "@/shared/components/Dashboard/DataLoader";
import AddressForm from "@/shared/components/Dashboard/AddressForm";

interface EditAddressesStageProps {
  addressId: string;
  actions: {
    finish: () => void;
  };
}

export default function EditAddressesStage({
  addressId,
  actions,
}: EditAddressesStageProps) {
  const [data, setData] = useState<Address>();

  return (
    <DataLoader load={() => getAddress(addressId)} setData={setData}>
      <AddressForm
        defaultValues={data}
        onCancel={actions.finish}
        onSave={(addressData) =>
          updateAddress(
            addressId,
            addressData.label,
            addressData.recipientName,
            addressData.recipientPhoneNumber,
            addressData.recipientPostalCode,
            addressData.recipientDeliveryProvince,
            addressData.recipientDeliveryCity,
            addressData.recipientDeliveryAddress
          )
            .then((message) => {
              toast.success(message);
              actions.finish();
            })
            .catch(toast.error)
        }
      />
    </DataLoader>
  );
}
