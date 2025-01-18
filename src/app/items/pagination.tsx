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

const TablePagination = ({ currentPage }: { currentPage: number }) => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "table";

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious
                href={`/items?view=${view}&page=${currentPage - 1}`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`/items?view=${view}&page=${currentPage - 1}`}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink
            href={`/items?view=${view}&page=${currentPage}`}
            isActive
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`/items?view=${view}&page=${currentPage + 1}`}>
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`/items?view=${view}&page=${currentPage + 1}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
