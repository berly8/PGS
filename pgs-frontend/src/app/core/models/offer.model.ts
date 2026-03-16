export type OfferStatus = 'OPEN' | 'CLOSED' | 'EXPIRED';

export interface Offer {
  id: number;
  title: string;
  description: string;
  location: string;
  domain: string;
  durationWeeks: number;
  startDate: string;
  endDate: string;
  compensation: number;
  requirements: string;
  status: OfferStatus;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  createdAt: string;
  applicationCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
