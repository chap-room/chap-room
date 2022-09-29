import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import AddressForm from "@chap-room/shared/components/Dashboard/AddressForm";

export default function DashboardEditAddresse() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const { addressId } = useParams();
  const address = data.state.addresses.filter(
    (item) => item.id === addressId
  )[0];

  return (
    <SectionContent>
      <Helmet title="داشبورد - ویرایش آدرس" />
      <ContentHeader title="ویرایش کردن آدرس" />
      <MobileContentHeader title="ویرایش کردن آدرس" />
      <AddressForm
        defaultValues={address}
        onCancel={() => navigate("/dashboard/addresses")}
        onSave={(addressData) => {
          data.dispatch({
            type: "ADDRESSES:UPDATE",
            payload: {
              id: addressId!,
              ...addressData,
            },
          });
          navigate("/dashboard/addresses");
        }}
      />
    </SectionContent>
  );
}
