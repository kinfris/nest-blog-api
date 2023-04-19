export class QueryFilterModel {
  searchNameTerm = '';
  searchEmailTerm = '';
  searchLoginTerm = '';
  sortBy = 'createdAt';
  sortDirection: 'desc' | 'asc' = 'desc';
  pageNumber = 1;
  pageSize = 10;
  banStatus: 'all' | 'banned' | 'notBanned' = 'all';

  constructor(query: QueryType) {
    if (query.searchNameTerm) {
      this.searchNameTerm = query.searchNameTerm.toLowerCase();
    }

    if (query.searchEmailTerm) {
      this.searchEmailTerm = query.searchEmailTerm.toLowerCase();
    }

    if (query.searchLoginTerm) {
      this.searchLoginTerm = query.searchLoginTerm.toLowerCase();
    }

    if (query.sortBy) {
      this.sortBy = query.sortBy;
    }

    if (query.sortDirection === 'desc' || query.sortDirection === 'asc') {
      this.sortDirection = query.sortDirection;
    }

    if (query.pageNumber && +query.pageNumber > 0) {
      this.pageNumber = Number.parseInt(query.pageNumber);
    }

    if (query.pageSize && +query.pageSize > 0) {
      this.pageSize = Number.parseInt(query.pageSize);
    }

    if (
      query.banStatus === 'all' ||
      query.banStatus === 'banned' ||
      query.banStatus === 'notBanned'
    ) {
      this.banStatus = query.banStatus;
    }
  }
}

export type QueryType = {
  searchNameTerm?: string;
  searchEmailTerm?: string;
  searchLoginTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber: string;
  pageSize: string;
  banStatus?: string;
};

export interface IQueryFilter {
  searchNameTerm?: string;
  searchEmailTerm?: string;
  searchLoginTerm?: string;
  sortBy?: string;
  sortDirection: 'desc' | 'asc';
  pageNumber: number;
  pageSize: number;
  banStatus: 'all' | 'banned' | 'notBanned';
}
