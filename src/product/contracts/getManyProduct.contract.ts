export enum ProductSortEnum {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum SortColumnEnum {
  price = 'basePrice',
  created = 'createdAt',
}

export class GetManyProductContract {
  sort?: ProductSortEnum;
  sortColumn?: string;
  limit?: number;
  offset?: number;
  title?: string;
  onlyImage?: boolean;
}
