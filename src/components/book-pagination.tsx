import { PaginationNext } from '@kobalte/core/src/pagination/pagination-next.jsx';
import { PaginationPrevious } from '@kobalte/core/src/pagination/pagination-previous.jsx';
import { action, useNavigate, useSubmission } from '@solidjs/router';
import { Button } from '~/components/ui/button';
import {
  Pagination,
  PaginationItems,
  PaginationEllipsis,
  PaginationItem,
} from '~/components/ui/pagination';

const formAction = action(async () => {
  const navigate = useNavigate()
  navigate('/')
})

function FormValues(props: {
  searchParams: { [key: string]: string | string[] | undefined };
  pageNumber: number;
}) {
  let { pending } = useSubmission(formAction);

  return (
    <div data-pending={pending ? '' : undefined}>
      {/* Keep the existing search params */}
      {Object.entries(props.searchParams).map(
        ([key, value]) =>
          key !== 'page' && (
            <input type="hidden" name={key} value={value as string} />
          )
      )}
      <input type="hidden" name="page" value={props.pageNumber.toString()} />
    </div>
  );
}

export function BookPagination(props: {
  currentPage: number;
  totalPages: number;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    pageNumbers.push(1);
    if (props.currentPage > 3) pageNumbers.push('...');
    for (
      let i = Math.max(2, props.currentPage - 1);
      i <= Math.min(props.totalPages - 1, props.currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }
    if (props.currentPage < props.totalPages - 2) pageNumbers.push('...');
    if (props.totalPages > 1 && !pageNumbers.includes(props.totalPages))
      pageNumbers.push(props.totalPages);
    return pageNumbers;
  };

  return (
    <Pagination
      count={10}
      itemComponent={(itemProps) => {
      return (
        <>
        <div class="flex md:hidden">
          <PaginationItem page={itemProps.page}>
            <form action="/">
              <FormValues
                searchParams={props.searchParams}
                pageNumber={props.currentPage}
              />
              <Button type="submit" variant="outline">
                {props.currentPage}
              </Button>
            </form>
          </PaginationItem>
        </div>
        <div class="hidden md:flex">
            <PaginationItem page={itemProps.page}>
                <form action="/">
                  <FormValues
                    searchParams={props.searchParams}
                    pageNumber={props.pageNumber as number}
                  />
                  <Button
                    type="submit"
                    variant={props.pageNumber === props.currentPage ? 'outline' : 'ghost'}
                  >
                    {itemProps.page}
                  </Button>
                </form>
            </PaginationItem>
        </div>
        </>
      )
     }}
      ellipsisComponent={() => <PaginationEllipsis />}
    >
      <PaginationPrevious onClick={() => {}}/>
      <PaginationNext onClick={() => {}}/>
    </Pagination>
  );
}