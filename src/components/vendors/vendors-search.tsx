"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSmartFilter } from "@/hooks/useSmartFilter";

export const VendorsSearch = () => {
  const { updateFilter, getFilter } = useSmartFilter();
  const searchTerm = getFilter("searchTerm");

  return (
    <div className="relative h-fit w-full lg:w-72">
      <Input
        placeholder="Search vendors..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) =>
          updateFilter("searchTerm", e.target.value, { debounce: 400 })
        }
      />
      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
