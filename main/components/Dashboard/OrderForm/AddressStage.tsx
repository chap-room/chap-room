import styles from "./style.module.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Address } from "@/shared/types";
import { deleteAddress, getAddresses } from "@/main/api";
import DataLoader from "@/shared/components/DataLoader";
import AddressView from "@/shared/components/Dashboard/AddressView";
import Radio from "@/shared/components/Radio";
import WarningConfirmDialog from "@/shared/components/Dashboard/WarningConfirmDialog";
import BottomActions from "@/shared/components/Dashboard/BottomActions";
import Button from "@/shared/components/Button";

interface AddressStageProps {
  data: Address[];
  setData: (newValue: Address[]) => void;
  selectedAddressId: number | null;
  setSelectedAddressId: (addressId: number | null) => void;
  actions: {
    back: () => void;
    new: () => void;
    edit: (addressId: number) => void;
    finish: () => void;
  };
}

export default function AddressStage({
  data,
  setData,
  selectedAddressId,
  setSelectedAddressId,
  actions,
}: AddressStageProps) {
  const [pendingAddressDeleteRequest, setPendingAddressDeleteRequest] =
    useState<number | null>(null);

  useEffect(() => {
    if (selectedAddressId === null && data[0]) setSelectedAddressId(data[0].id);
  }, [data]);

  const reloadRef = useRef<(() => void) | null>(null);

  return (
    <DataLoader
      load={() => getAddresses(0)}
      setData={({ addresses }) => setData(addresses)}
      reloadRef={reloadRef}
    >
      <div className={styles.AddressSelect}>
        {data.map((address) => (
          <Fragment key={address.id}>
            <Radio
              checked={address.id === selectedAddressId}
              onChecked={() => setSelectedAddressId(address.id)}
            />
            <AddressView
              address={address}
              onEdit={() => actions.edit(address.id)}
              onDelete={() => setPendingAddressDeleteRequest(address.id)}
            />
          </Fragment>
        ))}
        <div />
        <button
          className={styles.NewAddressButton}
          onClick={() => actions.new()}
        >
          ایجاد آدرس جدید +
        </button>
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
              if (reloadRef.current) reloadRef.current();
            })
            .catch(toast.error)
        }
        message="از حذف این آدرس مطمئن هستید؟"
        confirmButtonText="حذف"
      />
      <BottomActions>
        <Button onClick={actions.back} style={{ fontWeight: "bold" }}>
          مرحله قبل
        </Button>
        <Button
          varient="filled"
          style={{ minWidth: 150 }}
          onClick={actions.finish}
          disabled={!data.map((item) => item.id).includes(selectedAddressId!)}
        >
          مرحله بعد
        </Button>
      </BottomActions>
    </DataLoader>
  );
}
