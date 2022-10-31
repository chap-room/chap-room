import styles from "./style.module.scss";
import { useState } from "react";
import toast from "react-hot-toast";
import { Address } from "@/shared/types";
import { deleteAddress, getAddresses } from "@/main/api";
import DataLoader from "@/shared/components/Dashboard/DataLoader";
import AddressView from "@/shared/components/Dashboard/AddressView";
import Radio from "@/shared/components/Radio";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import AreaButton from "@/shared/components/Dashboard/AreaButton";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface AddressStageProps {
  selectedAddressId: string | null;
  setSelectedAddressId: (addressId: string | null) => void;
  actions: {
    back: () => void;
    new: () => void;
    edit: (addressId: string) => void;
    finish: () => void;
  };
}

export default function AddressStage({
  selectedAddressId,
  setSelectedAddressId,
  actions,
}: AddressStageProps) {
  const [data, setData] = useState<Address[]>([]);

  const [pendingAddressDeleteRequest, setPendingAddressDeleteRequest] =
    useState<string | null>(null);

  return (
    <DataLoader
      load={() => getAddresses(0, 0)}
      setData={({ addresses }) => setData(addresses)}
    >
      <div className={styles.AddressSelect}>
        {data.map((address) => (
          <div key={address.id}>
            <Radio
              checked={address.id === selectedAddressId}
              onChecked={() => setSelectedAddressId(address.id)}
            />
            <AddressView
              address={address}
              onEdit={() => actions.edit(address.id)}
              onDelete={() => setPendingAddressDeleteRequest(address.id)}
            />
          </div>
        ))}
      </div>
      <WarningConfirmDialog
        open={pendingAddressDeleteRequest !== null}
        onClose={() => {
          setPendingAddressDeleteRequest(null);
        }}
        onConfirm={() =>
          deleteAddress(pendingAddressDeleteRequest!)
            .then((message) => {
              toast.success(message);
              setPendingAddressDeleteRequest(null);
            })
            .catch(toast.error)
        }
        message="از حذف این آدرس مطمئن هستید؟"
        confirmButtonText="حذف"
      />
      <AreaButton title="افزودن آدرس +" onClick={actions.new} />
      <BottomActions>
        <Button onClick={actions.back}>مرحله قبل</Button>
        <Button
          varient="filled"
          style={{ minWidth: 150 }}
          onClick={actions.finish}
          disabled={
            !data.map((item) => item.id).includes(selectedAddressId || "")
          }
        >
          مرحله بعد
        </Button>
      </BottomActions>
    </DataLoader>
  );
}
