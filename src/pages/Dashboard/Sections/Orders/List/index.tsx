import { useNavigate } from "react-router-dom";
import ContentHeader from "../../../../../components/Dashboard/ContentHeader";

export default function DashboardOrderList() {
  const navigate = useNavigate();
  
  return (
    <>
      <ContentHeader
        title="همه سفارشات من"
        actions={[
          {
            key: "add",
            label: "سفارش جدید",
            variant: "none",
            onClick: () => navigate("/dashboard/orders/new"),
          },
        ]}
      />
      Order List
    </>
  );
}
