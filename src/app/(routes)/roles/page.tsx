import { DataTable } from "@/components/ui/data-table";
import { rolesColumns } from "@/components/roles/columns";
import PageHeader from "@/components/ui/page-header";
import { getAllAdmins } from "@/services/admin";
import { AddAdminModal } from "@/components/roles/AddAdminModal";
import { getCurrentUser } from "@/services/auth";

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const { data, meta } = await getAllAdmins(query);
  const user = await getCurrentUser();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Admin & Role Management"
          description="Configure admin access levels and role-based permissions."
        />

        {isSuperAdmin && (
          <div className="flex w-full justify-start lg:w-auto lg:justify-end">
            <AddAdminModal />
          </div>
        )}
      </div>

      <DataTable
        columns={rolesColumns}
        data={data || []}
        meta={meta}
      />
    </div>
  );
}
