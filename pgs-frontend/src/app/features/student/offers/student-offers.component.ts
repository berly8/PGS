import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-student-offers',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Offres de stage</h2>
        <p>{{ totalOffers }} offre(s) disponible(s)</p>
      </div>

      <div class="filters">
        <div class="filter-wrapper">
          <svg class="filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input [(ngModel)]="domain" placeholder="Domaine..." class="filter-input" (keyup.enter)="search()" />
        </div>
        <div class="filter-wrapper">
          <svg class="filter-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <input [(ngModel)]="location" placeholder="Lieu..." class="filter-input" (keyup.enter)="search()" />
        </div>
        <button (click)="search()" class="btn-search">Rechercher</button>
        <button (click)="reset()" class="btn-reset">Reinitialiser</button>
      </div>

      <div class="offers-grid" *ngIf="offers.length > 0">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="offer-header">
            <div>
              <h3>{{ offer.title }}</h3>
              <span class="company">{{ offer.companyName }}</span>
            </div>
            <span class="domain-tag">{{ offer.domain }}</span>
          </div>
          <p class="description">{{ (offer.description || '') | slice:0:150 }}{{ (offer.description || '').length > 150 ? '...' : '' }}</p>
          <div class="offer-meta">
            <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> {{ offer.location }}</span>
            <span class="meta-item"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {{ offer.durationWeeks }} semaines</span>
            <span class="meta-item" *ngIf="offer.compensation">{{ offer.compensation }}&#8364;/mois</span>
            <span class="meta-item">{{ offer.applicationCount }} candidat(s)</span>
          </div>
          <div class="offer-footer">
            <span class="dates">{{ offer.startDate | date:'dd/MM/yyyy' }} &rarr; {{ offer.endDate | date:'dd/MM/yyyy' }}</span>
            <button (click)="openApplyModal(offer)" class="btn-apply"
                    [disabled]="appliedIds.has(offer.id)">
              {{ appliedIds.has(offer.id) ? 'Deja postule' : 'Postuler' }}
            </button>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="offers.length === 0 && !loading">Aucune offre trouvee.</div>
      <div class="loading" *ngIf="loading">Chargement...</div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="prevPage()" [disabled]="currentPage === 0" class="page-btn">Precedent</button>
        <span class="page-info">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1" class="page-btn">Suivant</button>
      </div>
    </div>

    <!-- Apply Modal -->
    <div class="modal-backdrop" *ngIf="selectedOffer" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Postuler</h3>
          <button class="modal-close" (click)="closeModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="modal-offer-info">
          <span class="modal-title">{{ selectedOffer.title }}</span>
          <span class="modal-company">{{ selectedOffer.companyName }}</span>
        </div>
        <div class="form-group">
          <label>Lettre de motivation</label>
          <textarea [(ngModel)]="coverLetter" rows="6" placeholder="Decrivez votre motivation..."></textarea>
        </div>
        <div class="form-group">
          <label>URL de votre CV</label>
          <input [(ngModel)]="cvUrl" placeholder="https://..." />
        </div>
        <div class="error-msg" *ngIf="applyError">{{ applyError }}</div>
        <div class="modal-actions">
          <button (click)="closeModal()" class="btn-cancel">Annuler</button>
          <button (click)="submitApplication()" class="btn-submit" [disabled]="applying">
            {{ applying ? 'Envoi...' : 'Envoyer ma candidature' }}
          </button>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page {
      padding: 2.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-header h2 {
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: #0a0e1a;
      margin: 0 0 0.35rem;
      letter-spacing: -0.02em;
    }
    .page-header p {
      color: #6b7280;
      margin: 0;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
    }
    .filters {
      display: flex;
      gap: 0.8rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .filter-wrapper {
      flex: 1;
      min-width: 150px;
      position: relative;
    }
    .filter-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6b7280;
      pointer-events: none;
    }
    .filter-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      background: #ffffff;
      color: #0a0e1a;
      box-sizing: border-box;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .filter-input:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 4px rgba(76, 61, 206, 0.1);
    }
    .filter-input::placeholder { color: #9ca3af; }
    .btn-search {
      padding: 0.75rem 1.5rem;
      background: #4c3dce;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-search:hover {
      background: #3d30a8;
      transform: translateY(-1px);
    }
    .btn-reset {
      padding: 0.75rem 1.2rem;
      background: #faf6f1;
      color: #0a0e1a;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .btn-reset:hover {
      background: #f3efe9;
      border-color: #d5d0c8;
    }
    .offers-grid {
      display: grid;
      gap: 1rem;
    }
    .offer-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid #e8e4de;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.04);
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .offer-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 12px 28px rgba(0,0,0,0.08);
    }
    .offer-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.8rem;
      gap: 1rem;
    }
    .offer-header h3 {
      margin: 0 0 0.35rem;
      color: #0a0e1a;
      font-size: 1.1rem;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-weight: 600;
    }
    .company {
      font-size: 0.85rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
    }
    .domain-tag {
      background: rgba(76, 61, 206, 0.1);
      color: #4c3dce;
      padding: 0.3rem 0.85rem;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
    }
    .description {
      color: #4b5563;
      font-size: 0.9rem;
      margin: 0 0 1rem;
      line-height: 1.6;
      font-family: 'DM Sans', sans-serif;
    }
    .offer-meta {
      display: flex;
      gap: 1.2rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .meta-item {
      font-size: 0.82rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }
    .meta-item svg { color: #9ca3af; }
    .offer-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #f3efe9;
    }
    .dates {
      font-size: 0.82rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
    .btn-apply {
      padding: 0.55rem 1.3rem;
      background: #059669;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-apply:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-1px);
    }
    .btn-apply:disabled {
      background: rgba(5, 150, 105, 0.1);
      color: #059669;
      cursor: default;
    }
    .empty, .loading {
      text-align: center;
      padding: 4rem;
      color: #9ca3af;
      font-family: 'DM Sans', sans-serif;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    .page-btn {
      padding: 0.55rem 1.3rem;
      border: 2px solid #e8e4de;
      background: #ffffff;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
      color: #0a0e1a;
      transition: border-color 0.2s, background 0.2s;
    }
    .page-btn:hover:not(:disabled) {
      border-color: #4c3dce;
      background: rgba(76, 61, 206, 0.04);
    }
    .page-btn:disabled { opacity: 0.4; cursor: default; }
    .page-info {
      font-size: 0.9rem;
      color: #6b7280;
      font-family: 'DM Sans', sans-serif;
      font-weight: 500;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 14, 26, 0.4);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .modal {
      background: #ffffff;
      border-radius: 20px;
      padding: 2rem;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
      animation: slideUp 0.3s ease;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .modal-header h3 {
      color: #0a0e1a;
      margin: 0;
      font-family: 'Bricolage Grotesque', sans-serif;
      font-size: 1.3rem;
      font-weight: 700;
    }
    .modal-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.3rem;
      border-radius: 8px;
      transition: background 0.2s;
      display: flex;
      align-items: center;
    }
    .modal-close:hover { background: #f3efe9; color: #0a0e1a; }
    .modal-offer-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.2rem;
      border-bottom: 1px solid #e8e4de;
    }
    .modal-title {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      color: #4c3dce;
      font-size: 1rem;
    }
    .modal-company {
      color: #6b7280;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
    }
    .form-group {
      margin-bottom: 1.2rem;
    }
    .form-group label {
      display: block;
      font-weight: 600;
      color: #0a0e1a;
      margin-bottom: 0.45rem;
      font-size: 0.9rem;
      font-family: 'DM Sans', sans-serif;
    }
    .form-group input, .form-group textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      color: #0a0e1a;
      background: #ffffff;
      transition: border-color 0.25s, box-shadow 0.25s;
    }
    .form-group input:focus, .form-group textarea:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 4px rgba(76, 61, 206, 0.1);
    }
    .form-group input::placeholder, .form-group textarea::placeholder { color: #9ca3af; }
    .error-msg {
      color: #dc2626;
      font-size: 0.85rem;
      margin-bottom: 1rem;
      font-family: 'DM Sans', sans-serif;
      background: rgba(220, 38, 38, 0.06);
      padding: 0.6rem 0.9rem;
      border-radius: 8px;
    }
    .modal-actions {
      display: flex;
      gap: 0.8rem;
      justify-content: flex-end;
      padding-top: 0.5rem;
    }
    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #faf6f1;
      border: 2px solid #e8e4de;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.95rem;
      font-family: 'DM Sans', sans-serif;
      color: #0a0e1a;
      transition: background 0.2s;
    }
    .btn-cancel:hover { background: #f3efe9; }
    .btn-submit {
      padding: 0.75rem 1.5rem;
      background: #059669;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.2s, transform 0.15s;
    }
    .btn-submit:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-1px);
    }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class StudentOffersComponent implements OnInit {
  offers: Offer[] = [];
  totalOffers = 0;
  totalPages = 0;
  currentPage = 0;
  domain = '';
  location = '';
  loading = false;
  appliedIds = new Set<number>();

  selectedOffer: Offer | null = null;
  coverLetter = '';
  cvUrl = '';
  applying = false;
  applyError = '';

  constructor(private offerService: OfferService, private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadOffers();
    this.applicationService.getMyApplications().subscribe({
      next: apps => apps.forEach((a: any) => this.appliedIds.add(a.offerId)),
      error: () => {}
    });
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.searchOffers(this.domain || undefined, this.location || undefined, this.currentPage).subscribe({
      next: p => { this.offers = p.content; this.totalOffers = p.totalElements; this.totalPages = p.totalPages; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  search(): void { this.currentPage = 0; this.loadOffers(); }
  reset(): void { this.domain = ''; this.location = ''; this.search(); }
  prevPage(): void { if (this.currentPage > 0) { this.currentPage--; this.loadOffers(); } }
  nextPage(): void { if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.loadOffers(); } }

  openApplyModal(offer: Offer): void {
    this.selectedOffer = offer;
    this.coverLetter = '';
    this.cvUrl = '';
    this.applyError = '';
  }

  closeModal(): void { this.selectedOffer = null; }

  submitApplication(): void {
    if (!this.selectedOffer) return;
    this.applying = true;
    this.applyError = '';
    this.applicationService.applyToOffer(this.selectedOffer.id, this.coverLetter, this.cvUrl).subscribe({
      next: app => {
        this.appliedIds.add(app.offerId);
        this.applying = false;
        this.closeModal();
      },
      error: err => {
        this.applyError = err.error?.message || 'Erreur lors de la candidature';
        this.applying = false;
      }
    });
  }
}
