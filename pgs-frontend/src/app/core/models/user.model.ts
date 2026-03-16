export type Role = 'ADMIN' | 'STUDENT' | 'COMPANY' | 'SUPERVISOR';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
  companyName?: string;
  studentNumber?: string;
  program?: string;
  department?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  companyName?: string;
  studentNumber?: string;
  program?: string;
  department?: string;
}
