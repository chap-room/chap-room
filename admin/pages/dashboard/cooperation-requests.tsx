import { useContext, useState } from "react";
import Head from "next/head";
import { DataContext } from "@/admin/context/Data";
import { CooperationRequestStatus } from "@/shared/types";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import CooperationRequestTable from "@/admin/components/CooperationRequestTable";
import CooperationRequestAcceptDialog from "@/admin/components/CooperationRequestAcceptDialog";
import CooperationRequestRejectDialog from "@/admin/components/CooperationRequestRejectDialog";

export default function DashboardCooperationRequests() {
  const data = useContext(DataContext);

  const [
    filterByCooperationRequestStatus,
    setFilterByCooperationRequestStatus,
  ] = useState<CooperationRequestStatus | null>(
    CooperationRequestStatus.pending
  );
  const [
    pendingCooperationRequestAcceptRequest,
    setPendingCooperationRequestAcceptRequest,
  ] = useState<{ id: string; description: string | null } | null>(null);
  const [
    pendingCooperationRequestRejectRequest,
    setPendingCooperationRequestRejectRequest,
  ] = useState<{ id: string; description: string | null } | null>(null);

  const cooperationRequests = data.state.cooperationRequests.filter((item) => {
    if (filterByCooperationRequestStatus !== null) {
      if (item.status !== filterByCooperationRequestStatus) {
        return false;
      }
    }
    return true;
  });

  return (
    <DashboardLayout>
    <Head>
      <title></title>
    </Head>
      <Head>
        <title>داشبورد - درخواست های همکاری</title>
      </Head>
      <SectionHeader
        title="درخواست های همکاری"
        description="از این بخش درخواست های همکاری را مدیریت کنید"
        hideBackToSiteButton
      />
      <SectionContent>
        <ContentHeader
          title="همه درخواست ها"
          end={
            <SwitchButtons
              options={[
                {
                  id: CooperationRequestStatus.pending,
                  label: CooperationRequestStatus.pending,
                },
                {
                  id: CooperationRequestStatus.accepted,
                  label: CooperationRequestStatus.accepted,
                },
                {
                  id: CooperationRequestStatus.rejected,
                  label: CooperationRequestStatus.rejected,
                },
              ]}
              value={filterByCooperationRequestStatus}
              onChange={setFilterByCooperationRequestStatus}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه درخواست ها" />
        <CooperationRequestTable
          cooperationRequests={cooperationRequests}
          onAcceptCooperationRequest={(
            cooperationRequestId,
            cooperationRequestDescription
          ) => {
            setPendingCooperationRequestAcceptRequest({
              id: cooperationRequestId,
              description: cooperationRequestDescription,
            });
          }}
          onRejectCooperationRequest={(
            cooperationRequestId,
            cooperationRequestDescription
          ) => {
            setPendingCooperationRequestRejectRequest({
              id: cooperationRequestId,
              description: cooperationRequestDescription,
            });
          }}
          showDescription={
            filterByCooperationRequestStatus !==
            CooperationRequestStatus.pending
          }
        />
      </SectionContent>
      <CooperationRequestAcceptDialog
        open={pendingCooperationRequestAcceptRequest !== null}
        onClose={() => {
          setPendingCooperationRequestAcceptRequest(null);
        }}
        defaultValues={{
          description:
            pendingCooperationRequestAcceptRequest?.description || undefined,
        }}
        onAcceptCooperationRequest={(cooperationRequestAcceptData) => {
          data.dispatch({
            type: "COOPERATION_RRQUESTS:ACCEPT",
            payload: [
              pendingCooperationRequestAcceptRequest!.id,
              cooperationRequestAcceptData.description,
            ],
          });
          setPendingCooperationRequestAcceptRequest(null);
        }}
      />
      <CooperationRequestRejectDialog
        open={pendingCooperationRequestRejectRequest !== null}
        onClose={() => {
          setPendingCooperationRequestRejectRequest(null);
        }}
        defaultValues={{
          description:
            pendingCooperationRequestRejectRequest?.description || undefined,
        }}
        onRejectCooperationRequest={(cooperationRequestRejectData) => {
          data.dispatch({
            type: "COOPERATION_RRQUESTS:REJECT",
            payload: [
              pendingCooperationRequestRejectRequest!.id,
              cooperationRequestRejectData.description,
            ],
          });
          setPendingCooperationRequestRejectRequest(null);
        }}
      />
    </DashboardLayout>
  );
}
