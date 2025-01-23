"use client";

import { useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TablePagination = ({ itemCount }: { itemCount: number }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const buildUrl = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", page.toString());
    return `/items?${newParams.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={buildUrl(currentPage - 1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={buildUrl(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink href={buildUrl(currentPage)} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {currentPage < Math.ceil(itemCount / limit) && (
          <>
            <PaginationItem>
              <PaginationLink href={buildUrl(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={buildUrl(currentPage + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
