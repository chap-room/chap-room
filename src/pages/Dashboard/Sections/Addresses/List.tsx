import { useMemo, useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddressList from "../../../../components/Dashboard/AddressList";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Dialog from "../../../../components/Dialog";
import { DataContext } from "../../../../context/data";

export default function DashboardAddresseList() {
  const data = useContext(DataContext);
  const navigate = useNavigate();

  const addresses = useMemo(
    () => Array.from(data.state.addresses.values()),
    [data.state.addresses]
  );

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
        addresses={addresses}
        onEditAddress={(addressId) =>
          navigate(`/dashboard/addresses/edit/${addressId}`)
        }
        onDeleteAddress={(addressId) => {
          data.dispatch({
            type: "ADDRESSES:DELETE",
            payload: addressId,
          });
        }}
      />
    </>
  );
}
