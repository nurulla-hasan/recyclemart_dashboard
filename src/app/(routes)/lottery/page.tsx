

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { lotteryColumns } from "@/components/lottery/lottery-columns";
import PageHeader from "@/components/ui/page-header";
import { CreateLotteryForm } from "@/components/lottery/CreateLotteryForm";
import { getAllLotteries } from "@/services/lottery";

export default async function LotteryManagement() {
  const res = await getAllLotteries();
  const lotteries = res?.data || [];
  const meta = res?.meta 

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
       <PageHeader title="Lottery Management" description="Create and manage your lottery campaigns."/>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm" className="w-fit">
              <Plus /> Create Lottery
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto min-w-[400px] sm:min-w-[540px]">
            <SheetHeader>
              <SheetTitle>Create New Lottery</SheetTitle>
              <SheetDescription>
                Fill in the details below to create a new lottery campaign.
              </SheetDescription>
            </SheetHeader>
            <CreateLotteryForm />
          </SheetContent>
        </Sheet>
      </div>

      <DataTable
        columns={lotteryColumns}
        data={lotteries}
        meta={meta}
      />
    </div>
  );
}
