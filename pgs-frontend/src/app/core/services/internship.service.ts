import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Internship } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class InternshipService {

  private apiUrl = `${environment.apiUrl}/internships`;

  constructor(private http: HttpClient) {}

  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(this.apiUrl);
  }

  getMyInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.apiUrl}/my`);
  }

  getStudentInternship(): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/student`);
  }

  createInternship(applicationId: number, supervisorId?: number): Observable<Internship> {
    const params = supervisorId ? `?supervisorId=${supervisorId}` : '';
    return this.http.post<Internship>(`${this.apiUrl}/create/${applicationId}${params}`, {});
  }

  updateInternship(id: number, data: Partial<Internship>): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/${id}`, data);
  }
}
