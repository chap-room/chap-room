import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import Button from "../../../../components/Button";
import AddressList from "../../../../components/Dashboard/AddressList";
import WarningConfirmDialog from "../../../../components/Dashboard/WarningConfirmDialog";

export default function DashboardAddresseList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    string | null
  >(null);

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
        addresses={data.state.addresses}
        onEditAddress={(addressId) =>
          navigate(`/dashboard/addresses/edit/${addressId}`)
        }
        onDeleteAddress={setPendingDeleteRequest}
      />
      <WarningConfirmDialog
        open={pendingDeleteRequest !== null}
        onClose={() => {
          setPendingDeleteRequest(null);
        }}
        onConfirm={() => {
          data.dispatch({
            type: "ADDRESSES:DELETE",
            payload: pendingDeleteRequest!,
          });
          setPendingDeleteRequest(null);
        }}
        message="از حذف این آدرس مطمئن هستید؟"
        confirmButtonText="حذف"
      />
    </>
  );
}
