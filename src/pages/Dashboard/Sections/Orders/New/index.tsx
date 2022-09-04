import { useNavigate } from "react-router-dom";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";
import BottomActions from "../../../../../components/Dashboard/BottomActions";
import { ReactComponent as ArrowBackIcon } from "../../../../../assets/svg/arrowBack.svg";

export default function DashboardNewOrder() {
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
            onClick: () => navigate("/dashboard/orders"),
          },
        ]}
      />
      New Order
      <BottomActions actions={[
        {
          key: 'save',
          label: 'ذخیره',
          variant: 'filled',
          onClick: () => navigate("/dashboard/orders"),
        }
      ]} />
    </>
  );
}
