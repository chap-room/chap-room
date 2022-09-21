import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "../../../../context/DashboardData";
import { ReactComponent as AddIcon } from "../../../../assets/icons/add.svg";
import ContentHeader from "../../../../components/Dashboard/ContentHeader";
import MobileContentHeader from "../../../../components/Dashboard/MobileContentHeader";
import IconButton from "../../../../components/IconButton";
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
        title="آدرس های من"
        end={
          <Button onClick={() => navigate("/dashboard/addresses/new")}>
            افزودن آدرس
          </Button>
        }
      />
      <MobileContentHeader
        backTo="/dashboard"
        title="آدرس های من"
        end={
          <IconButton
            varient="filled"
            onClick={() => navigate("/dashboard/addresses/new")}
          >
            <AddIcon />
          </IconButton>
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
