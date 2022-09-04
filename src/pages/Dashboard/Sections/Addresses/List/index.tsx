import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddressList from "../../../../../components/Dashboard/AddressList";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";
import { DataContext } from "../../../../../dataContext";

export default function DashboardAddresseList() {
  const data = useContext(DataContext);
  const navigate = useNavigate();

  return (
    <>
      <ContentHeader
        title="همه آدرس های من"
        actions={[
          {
            key: "add",
            label: "افزودن آدرس",
            variant: "none",
            onClick: () => navigate("/dashboard/addresses/new"),
          },
        ]}
      />
      <AddressList
        addresses={data.addresses}
        onEditAddress={(addressId) =>
          navigate(`/dashboard/addresses/edit/${addressId}`)
        }
        onDeleteAddress={(addressId) => {
          data.setAddresses(
            data.addresses.filter((address) => address.id !== addressId)
          );
        }}
      />
    </>
  );
}
