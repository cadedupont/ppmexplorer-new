'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const BreadcrumbTrail = ({
  currentItem,
  searchParams,
}: {
  currentItem: string;
  searchParams: URLSearchParams;
}) => {
  const query = searchParams.get('query');
  const previousItems = searchParams.get('previous')?.split(',') || [];
  const isMobile = useIsMobile();

  const formatItem = (item: string) => {
    const [, volume, , page, , image] = item.split('_');
    return `Volume ${Number(volume)}, Page ${Number(page)} (Image ${Number(image)})`;
  };

  return (
    <div>
      <Breadcrumb className="mb-8 mt-8 md:mt-0">
        <BreadcrumbList>
          {isMobile ? (
            <>
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {previousItems.reverse().map((item, index) => {
                      const newParams = new URLSearchParams(searchParams.toString());
                      newParams.set('previous', previousItems.slice(0, index).reverse().join(','));
                      return (
                        <DropdownMenuItem key={index}>
                          <BreadcrumbLink href={`/items/${item}?${newParams.toString()}`}>
                            {formatItem(item)}
                          </BreadcrumbLink>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuItem>
                      <BreadcrumbLink
                        href={`/items?${(() => {
                          const newParams = new URLSearchParams(searchParams.toString());
                          newParams.delete('previous');
                          return newParams.toString();
                        })()}`}
                      >
                        {query
                          ? `Search "${query}"`
                          : searchParams.has('view')
                            ? (searchParams.get('view')?.charAt(0).toUpperCase() || '') +
                              (searchParams.get('view')?.slice(1) || '')
                            : 'Explore'}
                      </BreadcrumbLink>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/items?${(() => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    newParams.delete('previous');
                    return newParams.toString();
                  })()}`}
                >
                  {query
                    ? `Search "${query}"`
                    : searchParams.has('view')
                      ? (searchParams.get('view')?.charAt(0).toUpperCase() || '') +
                        (searchParams.get('view')?.slice(1) || '')
                      : 'Explore'}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          {isMobile
            ? null
            : previousItems.length >= 2 && (
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
                            const originalIndex = previousItems.length - 2 - reverseIndex;
                            const newParams = new URLSearchParams(searchParams.toString());
                            if (originalIndex > 0) {
                              newParams.set(
                                'previous',
                                previousItems.slice(0, originalIndex).join(','),
                              );
                            } else {
                              newParams.delete('previous');
                            }

                            return (
                              <DropdownMenuItem key={reverseIndex}>
                                <BreadcrumbLink href={`/items/${item}?${newParams.toString()}`}>
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
          {!isMobile && previousItems.length >= 1 && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/items/${previousItems[previousItems.length - 1]}?${(() => {
                    const newParams = new URLSearchParams(searchParams.toString());
                    const previous = previousItems.slice(0, -1).join(',');
                    if (previous) {
                      newParams.set('previous', previous);
                    } else {
                      newParams.delete('previous');
                    }
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
            <BreadcrumbPage>{currentItem ? formatItem(currentItem) : 'Current'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbTrail;
