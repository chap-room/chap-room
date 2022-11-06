import { ReactElement, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { CooperationRequest, CooperationRequestStatus } from "@/shared/types";
import { getCooperationRequests, updateCooperationRequest } from "@/admin/api";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import DataLoader from "@/shared/components/DataLoader";
import CooperationRequestTable from "@/admin/components/CooperationRequestTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import CooperationRequestAcceptDialog from "@/admin/components/CooperationRequestAcceptDialog";
import CooperationRequestRejectDialog from "@/admin/components/CooperationRequestRejectDialog";

export default function DashboardCooperationRequests() {
  const [itemsStatus, setItemsStatus] = useState<CooperationRequestStatus>(
    CooperationRequestStatus.pending
  );

  const [data, setData] = useState<{
    countOfItems: number;
    cooperations: CooperationRequest[];
  }>({ countOfItems: 0, cooperations: [] });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [
    pendingCooperationRequestAcceptRequest,
    setPendingCooperationRequestAcceptRequest,
  ] = useState<{ id: number; description: string | null } | null>(null);
  const [
    pendingCooperationRequestRejectRequest,
    setPendingCooperationRequestRejectRequest,
  ] = useState<{ id: number; description: string | null } | null>(null);

  const [reload, setRelaod] = useState(true);

  return (
    <>
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
                  id: CooperationRequestStatus.approved,
                  label: CooperationRequestStatus.approved,
                },
                {
                  id: CooperationRequestStatus.rejected,
                  label: CooperationRequestStatus.rejected,
                },
              ]}
              value={itemsStatus}
              onChange={setItemsStatus}
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title="همه درخواست ها" />
        <DataLoader
          load={() => {
            if (reload) {
              setRelaod(false);
              return getCooperationRequests(search, page);
            }
          }}
          deps={[reload]}
          setData={setData}
        >
          <CooperationRequestTable
            cooperationRequests={data.cooperations}
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
            showDescription={itemsStatus !== CooperationRequestStatus.pending}
            itemsStatus={itemsStatus}
          />
          {!data.cooperations.length && (
            <EmptyNote>هیچ درخواست همکاری ندارید</EmptyNote>
          )}
          <CooperationRequestAcceptDialog
            open={pendingCooperationRequestAcceptRequest !== null}
            onClose={() => {
              setPendingCooperationRequestAcceptRequest(null);
            }}
            defaultValues={{
              description:
                pendingCooperationRequestAcceptRequest?.description ||
                undefined,
            }}
            onAcceptCooperationRequest={(cooperationRequestAcceptData) =>
              updateCooperationRequest(
                pendingCooperationRequestAcceptRequest!.id,
                CooperationRequestStatus.approved,
                cooperationRequestAcceptData.description
              )
                .then((message) => {
                  toast.success(message);
                  setPendingCooperationRequestAcceptRequest(null);
                  setRelaod(true);
                })
                .catch(toast.error)
            }
          />
          <CooperationRequestRejectDialog
            open={pendingCooperationRequestRejectRequest !== null}
            onClose={() => {
              setPendingCooperationRequestRejectRequest(null);
            }}
            defaultValues={{
              description:
                pendingCooperationRequestRejectRequest?.description ||
                undefined,
            }}
            onRejectCooperationRequest={(cooperationRequestRejectData) =>
              updateCooperationRequest(
                pendingCooperationRequestRejectRequest!.id,
                CooperationRequestStatus.rejected,
                cooperationRequestRejectData.description
              )
                .then((message) => {
                  toast.success(message);
                  setPendingCooperationRequestRejectRequest(null);
                  setRelaod(true);
                })
                .catch(toast.error)
            }
          />
        </DataLoader>
      </SectionContent>
    </>
  );
}

DashboardCooperationRequests.getLayout = function getLayout(
  page: ReactElement
) {
  return <DashboardLayout>{page}</DashboardLayout>;
};