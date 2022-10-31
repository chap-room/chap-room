import styles from "./style.module.scss";
import { useState } from "react";
import TextArea from "@/shared/components/TextArea";
import ContentSelect from "@/shared/components/ContentSelect";
import TextInput from "@/shared/components/TextInput";
import iranProvincesAndCitiesJson from "@/shared/assets/json/iranProvincesAndCities.json";
import Button from "@/shared/components/Button";
import BottomActions from "@/shared/components/Dashboard/BottomActions";

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
  defaultValues?: Partial<AddressFormData>;
  onCancel?: () => void;
  onSave: (data: AddressFormData) => Promise<any>;
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <div className={styles.Form}>
        <TextInput
          inputProps={{ placeholder: "عنوان" }}
          value={label}
          onChange={(newValue) => setLabel(newValue)}
        />
        <TextInput
          inputProps={{ placeholder: "نام تحویل گیرنده" }}
          value={recipientName}
          onChange={(newValue) => setRecipientName(newValue)}
        />
        <TextInput
          inputProps={{
            type: "number",
            placeholder: "شماره موبایل تحویل گیرنده",
          }}
          value={recipientPhoneNumber}
          onChange={(newValue) =>
            setRecipientPhoneNumber(newValue.substring(0, 11))
          }
        />
        <TextInput
          inputProps={{ type: "number", placeholder: "کد پستی" }}
          value={recipientPostalCode}
          onChange={(newValue) =>
            setRecipientPostalCode(newValue.substring(0, 10))
          }
        />
        <div className={styles.ProvinceAndCitySelects}>
          <ContentSelect
            placeholder="استان"
            options={Object.keys(iranProvincesAndCities)}
            value={recipientDeliveryProvince}
            onChange={(newValue) => {
              setRecipientDeliveryProvince(newValue);
              setRecipientDeliveryCity("");
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
        {onCancel && <Button onClick={() => onCancel()}>بازگشت</Button>}
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            setIsSubmitting(true);
            onSave({
              label,
              recipientName,
              recipientPhoneNumber,
              recipientPostalCode,
              recipientDeliveryProvince,
              recipientDeliveryCity,
              recipientDeliveryAddress,
            }).finally(() => setIsSubmitting(false));
          }}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            !label ||
            !recipientName ||
            !recipientPhoneNumber ||
            recipientPhoneNumber.length !== 11 ||
            !recipientPhoneNumber.startsWith("09") ||
            isNaN(parseInt(recipientPhoneNumber)) ||
            !recipientPostalCode ||
            recipientPostalCode.length !== 10 ||
            isNaN(parseInt(recipientPostalCode)) ||
            !recipientDeliveryProvince ||
            !recipientDeliveryCity ||
            !recipientDeliveryAddress
          }
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
