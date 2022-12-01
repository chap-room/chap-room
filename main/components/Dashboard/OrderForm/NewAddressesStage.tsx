import toast from "react-hot-toast";
import { newAddress } from "@/main/api";
import AddressForm from "@/shared/components/Dashboard/AddressForm";

interface NewAddressesStageProps {
  actions: {
    finish: () => void;
  };
}

export default function NewAddressesStage({ actions }: NewAddressesStageProps) {
  return (
    <AddressForm
      inputsVarient="shadow"
      onSave={(addressData) =>
        newAddress(addressData)
          .then((message) => {
            toast.success(message);
            actions.finish();
          })
          .catch(toast.error)
      }
    />
  );
}
