import { DataTable } from "@/components/ui/data-table";
import PageHeader from "@/components/ui/page-header";
import { vendorsColumns } from "@/components/vendors/columns";
import { VendorsSearch } from "@/components/vendors/vendors-search";
import { getAllVendors } from "@/services/vendors";
import { SearchParams } from "@/types/global.types";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const result = await getAllVendors(params);
  const { data: vendors, meta } = result;

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Vendor Management"
          description="Manage vendors, verify stores, and handle approvals."
          length={meta.total}
        />

        <VendorsSearch />
      </div>
      <DataTable columns={vendorsColumns} data={vendors} meta={meta} />
    </div>
  );
}
