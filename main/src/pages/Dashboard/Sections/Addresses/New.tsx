import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import AddressForm from "@chap-room/shared/components/Dashboard/AddressForm";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";

export default function DashboardNewAddresse() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  return (
    <SectionContent>
      <Helmet title="داشبورد - افزودن آدرس" />
      <ContentHeader title="افزودن آدرس جدید" />
      <MobileContentHeader title="افزودن آدرس جدید" />
      <AddressForm
        onCancel={() => navigate("/dashboard/addresses")}
        onSave={(addressData) => {
          data.dispatch({
            type: "ADDRESSES:PUSH",
            payload: {
              id: uuidv4(),
              ...addressData,
            },
          });
          navigate("/dashboard/addresses");
        }}
      />
    </SectionContent>
  );
}
