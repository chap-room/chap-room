import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import AddressForm from "../../../../components/Dashboard/AddressForm";
import BottomActions from "../../../../components/Dashboard/BottomActions";

export default function DashboardEditAddresse() {
  const data = useContext(DashboardDataContext);
  const { addressId } = useParams();
  const address = data.state.addresses[addressId!];

  const [label, setLabel] = useState(address.label);
  const [recipientName, setRecipientName] = useState(address.recipientName);
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(
    address.recipientPhoneNumber
  );
  const [recipientPostalCode, setRecipientPostalCode] = useState(
    address.recipientPostalCode
  );
  const [recipientDeliveryProvince, setRecipientDeliveryProvince] = useState(
    address.recipientDeliveryProvince
  );
  const [recipientDeliveryCity, setRecipientDeliveryCity] = useState(
    address.recipientDeliveryCity
  );
  const [recipientDeliveryAddress, setRecipientDeliveryAddress] = useState(
    address.recipientDeliveryAddress
  );

  const navigate = useNavigate();

  return (
    <>
      <Helmet title="داشبورد - ویرایش آدرس" />
      <ContentHeader
        title="ویرایش کردن آدرس"
        end={
          <Button onClick={() => navigate("/dashboard/addresses")}>
            انصراف و بازگشت <ArrowBackIcon />
          </Button>
        }
      />
      <AddressForm
        label={label}
        setLabel={setLabel}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        recipientPhoneNumber={recipientPhoneNumber}
        setRecipientPhoneNumber={setRecipientPhoneNumber}
        recipientPostalCode={recipientPostalCode}
        setRecipientPostalCode={setRecipientPostalCode}
        recipientDeliveryProvince={recipientDeliveryProvince}
        setRecipientDeliveryProvince={setRecipientDeliveryProvince}
        recipientDeliveryCity={recipientDeliveryCity}
        setRecipientDeliveryCity={setRecipientDeliveryCity}
        recipientDeliveryAddress={recipientDeliveryAddress}
        setRecipientDeliveryAddress={setRecipientDeliveryAddress}
      />
      <BottomActions>
        <Button
          varient="filled"
          style={{ minWidth: 100 }}
          onClick={() => {
            data.dispatch({
              type: "ADDRESSES:SET",
              payload: {
                id: addressId!,
                label,
                recipientName,
                recipientPhoneNumber,
                recipientPostalCode,
                recipientDeliveryProvince,
                recipientDeliveryCity,
                recipientDeliveryAddress,
              },
            });
            navigate("/dashboard/addresses");
          }}
        >
          ذخیره
        </Button>
      </BottomActions>
    </>
  );
}
