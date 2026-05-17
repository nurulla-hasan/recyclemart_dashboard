import { DataTable } from "@/components/ui/data-table";
import { categoriesColumns } from "@/components/categories/columns";
import PageHeader from "@/components/ui/page-header";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";
import { getAllCategories } from "@/services/categories";

export default async function CategoriesPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const { data: categories, meta } = await getAllCategories(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Category & Subcategory"
          description="Manage product categories and subcategories structure."
        />
        <AddCategoryModal />
      </div>
      <DataTable
        columns={categoriesColumns}
        data={categories}
        meta={meta}
      />
    </div>
  );
}
