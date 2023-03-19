export class PaginationModel {
  pagesCount: number;
  page;
  pageSize;
  totalCount;
  //items: <T>;

  constructor(page: number, pageSize: number, totalCount: number) {
    this.pagesCount = Math.ceil(totalCount / pageSize);
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
  }
}
