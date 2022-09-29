import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardDataContext } from "@chap-room/main/context/DashboardData";
import { ReactComponent as AddIcon } from "@chap-room/shared/assets/icons/add.svg";
import SectionContent from "@chap-room/shared/components/Dashboard/SectionContent";
import ContentHeader from "@chap-room/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@chap-room/shared/components/Dashboard/MobileContentHeader";
import IconButton from "@chap-room/shared/components/IconButton";
import Button from "@chap-room/shared/components/Button";
import AddressList from "@chap-room/shared/components/Dashboard/AddressList";
import WarningConfirmDialog from "@chap-room/shared/components/Dashboard/WarningConfirmDialog";

export default function DashboardAddresseList() {
  const data = useContext(DashboardDataContext);
  const navigate = useNavigate();

  const [pendingDeleteRequest, setPendingDeleteRequest] = useState<
    string | null
  >(null);

  return (
    <SectionContent>
      <Helmet title="داشبورد - آدرس ها" />
      <ContentHeader
        title="آدرس های من"
        end={
          <Button
            style={{ padding: 0 }}
            onClick={() => navigate("/dashboard/addresses/new")}
          >
            افزودن آدرس <AddIcon />
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
          navigate(`/dashboard/addresses/${addressId}/edit`)
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
    </SectionContent>
  );
}
