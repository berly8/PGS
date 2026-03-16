export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Application {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  offerId: number;
  offerTitle: string;
  companyName: string;
  coverLetter: string;
  cvUrl: string;
  status: ApplicationStatus;
  companyNote?: string;
  adminNote?: string;
  appliedAt: string;
  updatedAt: string;
}
