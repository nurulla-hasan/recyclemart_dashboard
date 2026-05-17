import PageHeader from "@/components/ui/page-header";
import { ContentManager } from "@/components/content/ContentManager";
import { getExtraData } from "@/services/extra-data";

export default async function ContentPage() {
  const res = await getExtraData();
  const initialData = res?.success ? res.data : {};

  return (
    <div className="min-w-0 max-w-full space-y-6 overflow-x-hidden">
      <PageHeader
        title="Content Management"
        description="Manage homepage carousel banners and advertisement sections."
      />

      <div className="min-w-0 max-w-full overflow-x-hidden">
        <ContentManager initialData={initialData} />
      </div>
    </div>
  );
}
