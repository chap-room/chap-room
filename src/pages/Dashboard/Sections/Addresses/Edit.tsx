import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../../../context/data";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import BottomActions from "../../../../components/Dashboard/BottomActions";
import AddressForm from "../../../../components/Dashboard/AddressForm";

export default function DashboardEditAddresse() {
  const data = useContext(DataContext);
  const { addressId } = useParams();
  const address = data.state.addresses.get(addressId!)!;

  const [label, setLabel] = useState(address.label);
  const [recipientName, setRecipientName] = useState(address.recipientName);
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState(
    address.recipientPhoneNumber
  );
  const [recipientPostalCode, setRecipientPostalCode] = useState(
    address.recipientPostalCode
  );
  const [recipientDeliveryState, setRecipientDeliveryState] = useState(
    address.recipientDeliveryState
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
      <ContentHeader
        title="ویرایش کردن آدرس"
        actions={[
          {
            key: "back",
            label: (
              <>
                انصراف و بازگشت <ArrowBackIcon />
              </>
            ),
            variant: "none",
            onClick: () => navigate("/dashboard/addresses"),
          },
        ]}
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
        recipientDeliveryState={recipientDeliveryState}
        setRecipientDeliveryState={setRecipientDeliveryState}
        recipientDeliveryCity={recipientDeliveryCity}
        setRecipientDeliveryCity={setRecipientDeliveryCity}
        recipientDeliveryAddress={recipientDeliveryAddress}
        setRecipientDeliveryAddress={setRecipientDeliveryAddress}
      />
      <BottomActions
        actions={[
          {
            key: "save",
            label: "ذخیره",
            variant: "filled",
            onClick: () => {
              data.dispatch({
                type: "ADDRESSES:SET",
                payload: {
                  id: addressId!,
                  label,
                  recipientName,
                  recipientPhoneNumber,
                  recipientPostalCode,
                  recipientDeliveryState,
                  recipientDeliveryCity,
                  recipientDeliveryAddress,
                },
              });
              navigate("/dashboard/addresses");
            },
          },
        ]}
      />
    </>
  );
}