import { useContext, useState } from "react";
import Head from "next/head";
import { DataContext } from "@/admin/context/Data";
import { WithdrawalRequestStatus } from "@/shared/types";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import WithdrawalRequestTable from "@/admin/components/WithdrawalRequestTable";
import WithdrawalRequestDoneDialog from "@/admin/components/WithdrawalRequestDoneDialog";
import WithdrawalRequestRejectDialog from "@/admin/components/WithdrawalRequestRejectDialog";

export default function DashboardWithdrawalRequests() {
  const data = useContext(DataContext);

  const [filterByWithdrawalRequestStatus, setFilterByWithdrawalRequestStatus] =
    useState<WithdrawalRequestStatus | null>(WithdrawalRequestStatus.pending);
  const [
    pendingWithdrawalRequestDoneRequest,
    setPendingWithdrawalRequestDoneRequest,
  ] = useState<string | null>(null);
  const [
    pendingWithdrawalRequestRejectRequest,
    setPendingWithdrawalRequestRejectRequest,
  ] = useState<string | null>(null);

  const withdrawalRequests = data.state.withdrawalRequests.filter((item) => {
    if (filterByWithdrawalRequestStatus !== null) {
      if (item.status !== filterByWithdrawalRequestStatus) {
        return false;
      }
    }
    return true;
  });

  return (
    <DashboardLayout>
      <Head>
        <title>داشبورد - درخواست های برداشت</title>
      </Head>
      <SectionHeader
        title="درخواست های برداشت"
        description="درخواست های برداشت از این بخش را مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه درخواست ها"
          end={
            <SwitchButtons
              options={[
                {
                  id: WithdrawalRequestStatus.pending,
                  label: WithdrawalRequestStatus.pending,
                },
                {
                  id: WithdrawalRequestStatus.done,
                  label: WithdrawalRequestStatus.done,
                },
                {
                  id: WithdrawalRequestStatus.rejected,
                  label: WithdrawalRequestStatus.rejected,
                },
              ]}
              value={filterByWithdrawalRequestStatus}
              onChange={setFilterByWithdrawalRequestStatus}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه درخواست ها" />
        <WithdrawalRequestTable
          withdrawalRequests={withdrawalRequests}
          onDoneWithdrawalRequest={setPendingWithdrawalRequestDoneRequest}
          onRejectWithdrawalRequest={setPendingWithdrawalRequestRejectRequest}
        />
      </SectionContent>
      <WithdrawalRequestDoneDialog
        open={pendingWithdrawalRequestDoneRequest !== null}
        onClose={() => {
          setPendingWithdrawalRequestDoneRequest(null);
        }}
        onDoneWithdrawalRequest={(transactionDate, transactionTrackingCode) => {
          data.dispatch({
            type: "WITHDRAWAL_RRQUESTS:DONE",
            payload: [
              pendingWithdrawalRequestDoneRequest!,
              transactionDate,
              transactionTrackingCode,
            ],
          });
          setPendingWithdrawalRequestDoneRequest(null);
        }}
      />
      <WithdrawalRequestRejectDialog
        open={pendingWithdrawalRequestRejectRequest !== null}
        onClose={() => {
          setPendingWithdrawalRequestRejectRequest(null);
        }}
        onRejectWithdrawalRequest={(reason) => {
          data.dispatch({
            type: "WITHDRAWAL_RRQUESTS:REJECT",
            payload: [pendingWithdrawalRequestRejectRequest!, reason],
          });
          setPendingWithdrawalRequestRejectRequest(null);
        }}
      />
    </DashboardLayout>
  );
}
