"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BreadcrumbTrail = ({
  currentItem,
  searchParams,
}: {
  currentItem: string;
  searchParams: URLSearchParams;
}) => {
  const query = searchParams.get("query");
  const previousItems = searchParams.get("previous")?.split(",") || [];

  const formatItem = (item: string) => {
    const [_, volume, __, page, ___, image] = item.split("_");
    return `Volume ${Number(volume)}, Page ${Number(page)} (Image ${Number(
      image
    )})`;
  };

  return (
    <div>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            {query ? (
              <>
                <BreadcrumbLink
                  href={`/items?${(() => {
                    const newParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    newParams.delete("previous");
                    return newParams.toString();
                  })()}`}
                >
                  Search "{query}"
                </BreadcrumbLink>
              </>
            ) : (
              <>
                <BreadcrumbLink href={`/items?${searchParams.toString()}`}>
                  {searchParams.has("view")
                    ? (searchParams.get("view")?.charAt(0).toUpperCase() ||
                        "") + (searchParams.get("view")?.slice(1) || "")
                    : "Explore"}
                </BreadcrumbLink>
              </>
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {previousItems.length >= 2 && (
            <>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {previousItems
                      .slice(0, -1)
                      .reverse()
                      .map((item, reverseIndex) => {
                        const originalIndex =
                          previousItems.length - 2 - reverseIndex;
                        const newParams = new URLSearchParams(
                          searchParams.toString()
                        );
                        originalIndex > 0
                          ? newParams.set(
                              "previous",
                              previousItems.slice(0, originalIndex).join(",")
                            )
                          : newParams.delete("previous");

                        return (
                          <DropdownMenuItem key={reverseIndex}>
                            <BreadcrumbLink
                              href={`/items/${item}?${newParams.toString()}`}
                            >
                              {formatItem(item)}
                            </BreadcrumbLink>
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {previousItems.length >= 1 && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/items/${
                    previousItems[previousItems.length - 1]
                  }?${(() => {
                    const newParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    const previous = previousItems.slice(0, -1).join(",");
                    previous
                      ? newParams.set("previous", previous)
                      : newParams.delete("previous");
                    return newParams.toString();
                  })()}`}
                >
                  {formatItem(previousItems[previousItems.length - 1])}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>
              {currentItem ? formatItem(currentItem) : "Current"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbTrail;
