import Select from "../../Select";
import TextArea from "../../TextArea";
import TextInput from "../../TextInput";
import styles from "./style.module.scss";

interface PrintFolderFormProps {
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientPhoneNumber: string;
  setRecipientPhoneNumber: (value: string) => void;
  recipientPostalCode: string;
  setRecipientPostalCode: (value: string) => void;
  recipientDeliveryProvince: string;
  setRecipientDeliveryProvince: (value: string) => void;
  recipientDeliveryCity: string;
  setRecipientDeliveryCity: (value: string) => void;
  recipientDeliveryAddress: string;
  setRecipientDeliveryAddress: (value: string) => void;
}

export default function PrintFolderForm(props: PrintFolderFormProps) {
  return (
    <div className={styles.Form}>
      {/* <TextInput
        placeholder="عنوان"
        value={props.label}
        onTextChange={(newText) => props.setLabel(newText)}
      /> */}
      <TextInput
        placeholder="نام تحویل گیرنده"
        value={props.recipientName}
        onTextChange={(newText) => props.setRecipientName(newText)}
      />
      <TextInput
        placeholder="شماره موبایل تحویل گیرنده"
        value={props.recipientPhoneNumber}
        onTextChange={(newText) => props.setRecipientPhoneNumber(newText)}
      />
      <TextInput
        placeholder="کد پستی"
        value={props.recipientPostalCode}
        onTextChange={(newText) => props.setRecipientPostalCode(newText)}
      />
      <div>
        <Select
          options={{
            test1: "Test 1",
            test2: "Test 2",
            test3: "Test 3",
            test4: "Test 4",
          }}
          value={props.recipientDeliveryProvince}
          onChange={(newValue) => props.setRecipientDeliveryProvince(newValue)}
        />
        <Select
          options={{
            test1: "Test 1",
            test2: "Test 2",
            test3: "Test 3",
            test4: "Test 4",
          }}
          value={props.recipientDeliveryCity}
          onChange={(newValue) => props.setRecipientDeliveryCity(newValue)}
        />
      </div>
      <TextArea
        placeholder="نشانی"
        rows={4}
        value={props.recipientDeliveryAddress}
        onTextChange={(newText) => props.setRecipientDeliveryAddress(newText)}
      />
    </div>
  );
}
