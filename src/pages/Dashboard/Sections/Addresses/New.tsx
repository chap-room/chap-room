import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../../context/data";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import BottomActions from "../../../../components/Dashboard/BottomActions";
import AddressForm from "../../../../components/Dashboard/AddressForm";

export default function DashboardNewAddresse() {
  const data = useContext(DataContext);

  const [label, setLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("");
  const [recipientDeliveryState, setRecipientDeliveryState] = useState("");
  const [recipientDeliveryCity, setRecipientDeliveryCity] = useState("");
  const [recipientDeliveryAddress, setRecipientDeliveryAddress] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <ContentHeader
        title="افزودن آدرس"
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
                  id: uuidv4(),
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
