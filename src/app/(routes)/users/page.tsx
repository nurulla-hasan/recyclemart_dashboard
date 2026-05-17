import { DataTable } from "@/components/ui/data-table";
import PageHeader from "@/components/ui/page-header";
import { usersColumns } from "@/components/users/columns";
import { UsersSearch } from "@/components/users/users-search";
import { getAllUsers } from "@/services/users";
import { SearchParams } from "@/types/global.types";

export default async function UsersPage({searchParams}: {searchParams: SearchParams}) {
  const params = await searchParams;
  const { data: users, meta } = await getAllUsers(params);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="User Management"
          description="Manage users, roles, and permissions here."
          length={meta.total}
        />
        <UsersSearch />
      </div>
      <DataTable
        columns={usersColumns}
        data={users}
        meta={meta}
      />
    </div>
  );
}
