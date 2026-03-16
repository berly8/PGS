import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Offer, PageResponse } from '../models/offer.model';

@Injectable({ providedIn: 'root' })
export class OfferService {

  private apiUrl = `${environment.apiUrl}/offers`;

  constructor(private http: HttpClient) {}

  searchOffers(domain?: string, location?: string, page = 0, size = 10): Observable<PageResponse<Offer>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (domain) params = params.set('domain', domain);
    if (location) params = params.set('location', location);
    return this.http.get<PageResponse<Offer>>(this.apiUrl, { params });
  }

  getOfferById(id: number): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }

  getOffersByCompany(companyId: number): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.apiUrl}/company/${companyId}`);
  }

  createOffer(offer: Partial<Offer>): Observable<Offer> {
    return this.http.post<Offer>(this.apiUrl, offer);
  }

  updateOffer(id: number, offer: Partial<Offer>): Observable<Offer> {
    return this.http.put<Offer>(`${this.apiUrl}/${id}`, offer);
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
