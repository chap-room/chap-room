import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/icons/arrowBack.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import AddressForm from "../../../../components/Dashboard/AddressForm";
import BottomActions from "../../../../components/Dashboard/BottomActions";

export default function DashboardNewAddresse() {
  const data = useContext(DashboardDataContext);

  const [label, setLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhoneNumber, setRecipientPhoneNumber] = useState("");
  const [recipientPostalCode, setRecipientPostalCode] = useState("");
  const [recipientDeliveryProvince, setRecipientDeliveryProvince] =
    useState("");
  const [recipientDeliveryCity, setRecipientDeliveryCity] = useState("");
  const [recipientDeliveryAddress, setRecipientDeliveryAddress] = useState("");

  const navigate = useNavigate();

  return (
    <>
      <Helmet title="داشبورد - افزودن آدرس" />
      <ContentHeader
        title="افزودن آدرس جدید"
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
                id: uuidv4(),
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
