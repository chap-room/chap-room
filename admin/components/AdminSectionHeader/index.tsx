import { ReactNode } from "react";
import SectionHeader from "@/shared/components/Dashboard/SectionHeader";
import OrderSearch from "@/admin/components/OrderSearch";

interface AdminSectionHeaderProps {
  titleStart?: ReactNode;
  title: string;
  titleCenter?: ReactNode;
  titleEnd?: ReactNode;
  description?: string;
}

export default function AdminSectionHeader({
  titleStart,
  title,
  titleCenter,
  titleEnd,
  description,
}: AdminSectionHeaderProps) {
  return (
    <>
      <SectionHeader
        titleStart={titleStart}
        title={title}
        titleCenter={
          <>
            <OrderSearch />
            {titleCenter}
          </>
        }
        titleEnd={titleEnd}
        description={description}
        isAdmin={true}
      />
    </>
  );
}
