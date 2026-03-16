import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Application, ApplicationStatus } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/my`);
  }

  getCompanyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/company`);
  }

  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.apiUrl);
  }

  getApplicationsByOffer(offerId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/offer/${offerId}`);
  }

  applyToOffer(offerId: number, coverLetter: string, cvUrl: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/apply/${offerId}`, { coverLetter, cvUrl });
  }

  updateStatus(id: number, status: ApplicationStatus, note?: string): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}/status`, { status, note });
  }

  withdraw(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/withdraw`, {});
  }
}
