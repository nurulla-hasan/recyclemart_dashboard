"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { DataTablePagination } from "./data-table-pagination";

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    headerClassName?: string;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  limit?: number;
  pageSize?: number;
  meta?: PaginationMeta;
  searchKey?: string;
  searchPlaceholder?: string;
  showFooter?: boolean;
}

function DataTableInner<TData, TValue>({
  columns,
  data,
  limit,
  pageSize = 10,
  meta,
  searchKey,
  searchPlaceholder,
  showFooter = false,
}: DataTableProps<TData, TValue>) {
  const resolvedPageSize = limit ?? pageSize;
  const { updateFilter, getFilter } = useSmartFilter<string>({
    paginationKey: "page",
    defaultDebounce: 500,
    defaultMethod: "replace",
  });

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: meta ? meta.page - 1 : 0,
    pageSize: resolvedPageSize,
  });

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageSize: resolvedPageSize,
      ...(meta && { pageIndex: meta.page - 1 }),
    }));
  }, [resolvedPageSize, meta]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount: meta
      ? (meta.totalPages ?? Math.ceil(meta.total / meta.limit))
      : undefined,
    state: {
      columnFilters,
      pagination,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    manualPagination: !!meta,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: meta ? undefined : getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full max-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder ?? `Search ${searchKey}...`}
              value={getFilter(searchKey)}
              onChange={(event) =>
                updateFilter(searchKey, event.target.value, {
                  debounce: 500,
                  method: "replace",
                })
              }
              className="pl-9"
            />
          </div>
        </div>
      )}

      <ScrollArea className="w-full rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-12 px-4 bg-accent",
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="h-12 pl-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {showFooter && (
            <TableFooter className="border-t">
              {table.getFooterGroups().map((footerGroup) => (
                <TableRow key={footerGroup.id}>
                  {footerGroup.headers.map((footer) => (
                    <TableCell key={footer.id} className="p-2">
                      {footer.isPlaceholder
                        ? null
                        : flexRender(
                            footer.column.columnDef.footer,
                            footer.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableFooter>
          )}
        </Table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {(meta || table.getPageCount() > 1) && (
        <DataTablePagination table={table} meta={meta} />
      )}
    </div>
  );
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  return (
    <React.Suspense fallback={null}>
      <DataTableInner {...props} />
    </React.Suspense>
  );
}
