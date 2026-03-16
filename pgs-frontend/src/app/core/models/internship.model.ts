export type InternshipStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';

export interface Internship {
  id: number;
  applicationId: number;
  studentName: string;
  studentEmail: string;
  offerTitle: string;
  companyName: string;
  supervisorId?: number;
  supervisorName?: string;
  startDate: string;
  endDate: string;
  status: InternshipStatus;
  supervisorReport?: string;
  grade?: number;
  objectives?: string;
  achievements?: string;
  createdAt: string;
}

export interface Statistics {
  totalStudents: number;
  totalCompanies: number;
  totalSupervisors: number;
  totalOffers: number;
  openOffers: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  activeInternships: number;
  completedInternships: number;
}
