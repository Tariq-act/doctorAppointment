"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import Image from "next/image";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageIndex = table.getState().pagination.pageIndex + 1;
  const pageCount = Math.max(table.getPageCount(), 1);
  const headers = table.getHeaderGroups()[0]?.headers ?? [];

  return (
    <section
      className='data-table glass-panel'
      aria-labelledby={title ? "appointments-heading" : undefined}
    >
      {title ? (
        <div className='border-b border-white/10 px-4 py-4 sm:px-5'>
          <h2 id='appointments-heading' className='text-18-bold text-white'>
            {title}
          </h2>
          {description ? (
            <p className='text-14-regular mt-1 text-dark-600'>{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className='hidden md:block'>
        <Table className='shad-table' aria-label={title ?? "Appointments"}>
          <TableHeader className='bg-white/[0.03]'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='shad-table-row-header'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='text-12-semibold h-12 uppercase tracking-[0.14em] text-dark-600'
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className='shad-table-row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-4'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-28 text-center text-dark-600'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='grid gap-3 p-3 md:hidden'>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <article key={row.id} className='appointment-card'>
              {row.getVisibleCells().map((cell, index) => {
                const header = headers[index];

                return (
                  <div
                    key={cell.id}
                    className='flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 last:border-b-0'
                  >
                    <span className='text-12-semibold shrink-0 uppercase tracking-[0.14em] text-dark-600'>
                      {header && !header.isPlaceholder
                        ? flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        : null}
                    </span>
                    <div className='min-w-0 text-right'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </div>
                );
              })}
            </article>
          ))
        ) : (
          <p className='text-14-regular px-2 py-8 text-center text-dark-600'>
            No results.
          </p>
        )}
      </div>

      <div className='table-actions'>
        <p className='text-14-regular text-dark-600' aria-live='polite'>
          Page {pageIndex} of {pageCount}
        </p>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className='shad-gray-btn'
            aria-label='Previous page'
          >
            <Image
              src='/assets/icons/arrow.svg'
              width={20}
              height={20}
              alt=''
            />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className='shad-gray-btn'
            aria-label='Next page'
          >
            <Image
              src='/assets/icons/arrow.svg'
              width={20}
              height={20}
              alt=''
              className='rotate-180'
            />
          </Button>
        </div>
      </div>
    </section>
  );
}
