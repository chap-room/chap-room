import styles from "./style.module.scss";
import TextArea from "../../TextArea";
import ContentSelect from "../../ContentSelect";
import TextInput from "../../TextInput";
import iranProvincesAndCitiesJson from "../../../assets/json/iranProvincesAndCities.json";
import { useState } from "react";
import Button from "../../Button";
import BottomActions from "../BottomActions";

const iranProvincesAndCities: Record<string, string[]> =
  iranProvincesAndCitiesJson;

interface AddressFormData {
  label: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientPostalCode: string;
  recipientDeliveryProvince: string;
  recipientDeliveryCity: string;
  recipientDeliveryAddress: string;
}
interface AddressFormProps {
  defaultValues?: AddressFormData;
  onCancel: () => void;
  onSave: (data: AddressFormData) => void;
}

export default function AddressForm({
  defaultValues,
  onCancel,
  onSave,
}: AddressFormProps) {
  const [label, setLabel] = useState(defaultValues?.label || "");
  const [recipientName, setRecipientName] = useState(
    defaultValues?.recipientName || ""
  );
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(
    defaultValues?.recipientPhoneNumber || ""
  );
  const [recipientPostalCode, setRecipientPostalCode] = useState(
    defaultValues?.recipientPostalCode || ""
  );
  const [recipientDeliveryProvince, setRecipientDeliveryProvince] = useState(
    defaultValues?.recipientDeliveryProvince || ""
  );
  const [recipientDeliveryCity, setRecipientDeliveryCity] = useState(
    defaultValues?.recipientDeliveryCity || ""
  );
  const [recipientDeliveryAddress, setRecipientDeliveryAddress] = useState(
    defaultValues?.recipientDeliveryAddress || ""
  );

  return (
    <>
      <div className={styles.Form}>
        <TextInput
          placeholder="عنوان"
          value={label}
          onTextChange={(newText) => setLabel(newText)}
        />
        <TextInput
          placeholder="نام تحویل گیرنده"
          value={recipientName}
          onTextChange={(newText) => setRecipientName(newText)}
        />
        <TextInput
          type="number"
          placeholder="شماره موبایل تحویل گیرنده"
          value={recipientPhoneNumber}
          onTextChange={(newText) =>
            setRecipientPhoneNumber(newText.substring(0, 11))
          }
        />
        <TextInput
          type="number"
          placeholder="کد پستی"
          value={recipientPostalCode}
          onTextChange={(newText) =>
            setRecipientPostalCode(newText.substring(0, 10))
          }
        />
        <div className={styles.ProvinceAndCitySelects}>
          <ContentSelect
            placeholder="استان"
            options={Object.keys(iranProvincesAndCities)}
            value={recipientDeliveryProvince}
            onChange={(newValue) => {
              setRecipientDeliveryProvince(newValue);
              setRecipientDeliveryCity("شهر");
            }}
          />
          <ContentSelect
            placeholder="شهر"
            options={iranProvincesAndCities[recipientDeliveryProvince] || []}
            value={recipientDeliveryCity}
            onChange={(newValue) => setRecipientDeliveryCity(newValue)}
            readOnly={!iranProvincesAndCities[recipientDeliveryProvince]}
          />
        </div>
        <TextArea
          placeholder="نشانی"
          rows={4}
          value={recipientDeliveryAddress}
          onTextChange={(newText) => setRecipientDeliveryAddress(newText)}
        />
      </div>
      <BottomActions>
        <Button onClick={() => onCancel()}>بازگشت</Button>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() =>
            onSave({
              label,
              recipientName,
              recipientPhoneNumber,
              recipientPostalCode,
              recipientDeliveryProvince,
              recipientDeliveryCity,
              recipientDeliveryAddress,
            })
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
