export enum ReviewStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface ReviewDto {
  name: string;
  review: string;
}
