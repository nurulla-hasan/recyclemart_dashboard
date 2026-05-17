import { subscribersColumns } from "@/components/subscribers/columns";
import { SubscribersSearch } from "@/components/subscribers/subscribers-search";
import { DataTable } from "@/components/ui/data-table";
import PageHeader from "@/components/ui/page-header";
import { getAllSubscribers } from "@/services/plans";
import { SearchParams } from "@/types/global.types";

export default async function SubscribersPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const { data: subscribers, meta } = await getAllSubscribers(params);

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Subscriber Management"
          description="Manage subscribers here."
          length={meta.total}
        />
        <SubscribersSearch />
      </div>
      <DataTable
        columns={subscribersColumns}
        data={subscribers}
        meta={meta}
      />
    </div>
  );
}
