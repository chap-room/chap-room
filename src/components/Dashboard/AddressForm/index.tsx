import styles from "./style.module.scss";
import TextArea from "../../TextArea";
import ContentSelect from "../../ContentSelect";
import TextInput from "../../TextInput";
import iranProvincesAndCitiesJson from "../../../assets/json/iranProvincesAndCities.json";

const iranProvincesAndCities: Record<string, string[]> =
  iranProvincesAndCitiesJson;

interface AddressFormProps {
  label: string;
  setLabel: (value: string) => void;
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

export default function AddressForm(props: AddressFormProps) {
  return (
    <div className={styles.Form}>
      <TextInput
        placeholder="عنوان"
        value={props.label}
        onTextChange={(newText) => props.setLabel(newText)}
      />
      <TextInput
        placeholder="نام تحویل گیرنده"
        value={props.recipientName}
        onTextChange={(newText) => props.setRecipientName(newText)}
      />
      <TextInput
        type="number"
        placeholder="شماره موبایل تحویل گیرنده"
        value={props.recipientPhoneNumber}
        onTextChange={(newText) => props.setRecipientPhoneNumber(newText.substring(0, 11))}
      />
      <TextInput
        type="number"
        placeholder="کد پستی"
        value={props.recipientPostalCode}
        onTextChange={(newText) => props.setRecipientPostalCode(newText.substring(0, 10))}
      />
      <div className={styles.ProvinceAndCitySelects}>
        <ContentSelect
          placeholder="استان"
          options={Object.keys(iranProvincesAndCities)}
          value={props.recipientDeliveryProvince}
          onChange={(newValue) => {
            props.setRecipientDeliveryProvince(newValue);
            props.setRecipientDeliveryCity("شهر");
          }}
        />
        <ContentSelect
          placeholder="شهر"
          options={
            iranProvincesAndCities[props.recipientDeliveryProvince] || []
          }
          value={props.recipientDeliveryCity}
          onChange={(newValue) => props.setRecipientDeliveryCity(newValue)}
          readOnly={!iranProvincesAndCities[props.recipientDeliveryProvince]}
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
