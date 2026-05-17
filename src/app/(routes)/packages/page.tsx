import PageHeader from "@/components/ui/page-header";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/packages/columns";
import { CreatePackageModal } from "@/components/packages/CreatePackageModal";
import { getAllPlans } from "@/services/plans";
import { SearchParams } from "@/types/global.types";

export default async function PackagesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const { data: packages, meta } = await getAllPlans(params);

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Packages / Membership Plans"
          description="Manage membership plans and pricing packages."
          length={packages.length}
        />
        <CreatePackageModal />
      </div>
      <DataTable columns={columns} data={packages} meta={meta} />
    </div>
  );
}
