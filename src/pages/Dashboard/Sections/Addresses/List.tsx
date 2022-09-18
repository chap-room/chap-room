import { useContext } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import AddressList from "../../../../components/Dashboard/AddressList";

export default function DashboardAddresseList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  return (
    <>
      <Helmet title="داشبورد - آدرس ها" />
      <ContentHeader
        title="ویرایش کردن آدرس"
        end={
          <Button onClick={() => navigate("/dashboard/addresses/new")}>
            افزودن آدرس
          </Button>
        }
      />
      <AddressList
        addresses={Object.values(data.state.addresses)}
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
