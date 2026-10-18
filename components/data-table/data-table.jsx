"use client"

import { useState } from "react"
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { ArrowsUpDownIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, basic: sortFn_basic, datetime: sortFn_datetime },
})

export function SortableHeader({ column, children, className }) {
  const sorted = column.getIsSorted()
  const Icon = sorted === "asc" ? ChevronUpIcon : sorted === "desc" ? ChevronDownIcon : ArrowsUpDownIcon
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-2.5", className)}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      <Icon data-icon="inline-end" className={cn(!sorted && "opacity-40")} />
    </Button>
  )
}

// Table on desktop; `renderMobileRow` (optional) swaps rows for cards below md.
export function DataTable({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Search...",
  initialSorting = [],
  pageSize = 10,
  onRowClick,
  rowClassName,
  renderMobileRow,
  toolbar,
  emptyMessage = "No results.",
}) {
  const [sorting, setSorting] = useState(initialSorting)
  const [columnFilters, setColumnFilters] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize })

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
  })

  const rows = table.getRowModel().rows
  const total = table.getFilteredRowModel().rows.length

  return (
    <div className="flex flex-col gap-4">
      {(filterColumn || toolbar) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {filterColumn && (
            <div className="relative w-full sm:max-w-xs">
              <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={filterPlaceholder}
                className="pl-8"
                value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
                onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
              />
            </div>
          )}
          {toolbar && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{toolbar}</div>}
        </div>
      )}

      <div className={cn("overflow-hidden rounded-xl border", renderMobileRow && "hidden md:block")}>
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} className="px-3">
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer", rowClassName?.(row.original))}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-3">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {renderMobileRow && (
        <div className="flex flex-col gap-3 md:hidden">
          {rows.length ? rows.map((row) => <div key={row.id}>{renderMobileRow(row.original)}</div>) : (
            <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
          )}
        </div>
      )}

      {total > pagination.pageSize && (
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
