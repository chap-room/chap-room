import { ReactElement, useRef, useState } from "react";
import toast from "react-hot-toast";
import Head from "next/head";
import { CooperationRequest } from "@/shared/types";
import { getCooperationRequests, updateCooperationRequest } from "@/admin/api";
import DashboardLayout from "@/admin/components/Layout";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import SectionContent from "@/shared/components/Dashboard/SectionContent";
import ContentHeader from "@/shared/components/Dashboard/ContentHeader";
import MobileContentHeader from "@/shared/components/Dashboard/MobileContentHeader";
import SwitchButtons from "@/shared/components/SwitchButtons";
import Controls from "@/admin/components/Controls";
import SearchInput from "@/admin/components/SearchInput";
import DataLoader from "@/shared/components/DataLoader";
import CooperationRequestTable from "@/admin/components/CooperationRequestTable";
import EmptyNote from "@/shared/components/Dashboard/EmptyNote";
import Pagination from "@/shared/components/Pagination";
import CooperationRequestAcceptDialog from "@/admin/components/CooperationRequestAcceptDialog";
import CooperationRequestRejectDialog from "@/admin/components/CooperationRequestRejectDialog";

export default function DashboardCooperationRequests() {
  const [itemsStatus, setItemsStatus] = useState<
    "approved" | "rejected" | null
  >(null);

  const [data, setData] = useState<{
    totalCount: number;
    pageSize: number;
    cooperations: CooperationRequest[];
  }>({ totalCount: 0, pageSize: 0, cooperations: [] });

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

  const reloadRef = useRef<(() => void) | null>(null);

  const title =
    itemsStatus === null
      ? "درخواست های در انتظار تایید"
      : itemsStatus === "approved"
      ? "درخواست های تایید شده"
      : itemsStatus === "rejected"
      ? "درخواست های رد تشده"
      : "";

  return (
    <>
      <Head>
        <title>داشبورد - درخواست های همکاری</title>
      </Head>
      <SectionHeader
        title="درخواست های همکاری"
        description="ــ از این بخش درخواست های همکاری را مدیریت کنید"
        isAdmin
      />
      <SectionContent>
        <ContentHeader
          title={title}
          end={
            <SwitchButtons
              options={[
                {
                  id: "rejected",
                  label: "رد شده",
                  color: "#f20f4b",
                },
                {
                  id: "approved",
                  label: "قبول شده",
                  color: "#14cc9c",
                },
              ]}
              value={itemsStatus}
              onChange={(newValue) => {
                setItemsStatus(newValue);
                setPage(1);
              }}
              nullable
            />
          }
        />
        <MobileContentHeader backTo="/dashboard" title={title} />
        <Controls
          start={
            <SearchInput
              inputProps={{ placeholder: "جستجو شماره موبایل" }}
              value={search}
              setValue={(newValue) => {
                setSearch(newValue);
                setPage(1);
              }}
            />
          }
        />
        <DataLoader
          load={() =>
            getCooperationRequests(
              search,
              page,
              itemsStatus === null ? "pending" : itemsStatus
            )
          }
          deps={[search, page, itemsStatus]}
          setData={setData}
          reloadRef={reloadRef}
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
            showDescription={itemsStatus !== null}
            itemsStatus={itemsStatus}
          />
          {!data.cooperations.length && (
            <EmptyNote>هیچ درخواست همکاری ندارید</EmptyNote>
          )}
          <Pagination
            currentPage={page}
            totalCount={data.totalCount}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
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
                "approved",
                cooperationRequestAcceptData.description
              )
                .then((message) => {
                  toast.success(message);
                  setPendingCooperationRequestAcceptRequest(null);
                  if (reloadRef.current) reloadRef.current();
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
                "rejected",
                cooperationRequestRejectData.description
              )
                .then((message) => {
                  toast.success(message);
                  setPendingCooperationRequestRejectRequest(null);
                  if (reloadRef.current) reloadRef.current();
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
