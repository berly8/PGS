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
        <input [(ngModel)]="domain" placeholder="Domaine..." class="filter-input" (keyup.enter)="search()" />
        <input [(ngModel)]="location" placeholder="Lieu..." class="filter-input" (keyup.enter)="search()" />
        <button (click)="search()" class="btn-search">🔍 Rechercher</button>
        <button (click)="reset()" class="btn-reset">Réinitialiser</button>
      </div>

      <div class="offers-grid" *ngIf="offers.length > 0">
        <div class="offer-card" *ngFor="let offer of offers">
          <div class="offer-header">
            <div>
              <h3>{{ offer.title }}</h3>
              <span class="company">🏢 {{ offer.companyName }}</span>
            </div>
            <span class="domain-tag">{{ offer.domain }}</span>
          </div>
          <p class="description">{{ (offer.description || '') | slice:0:150 }}{{ (offer.description || '').length > 150 ? '...' : '' }}</p>
          <div class="offer-meta">
            <span>📍 {{ offer.location }}</span>
            <span>⏱ {{ offer.durationWeeks }} semaines</span>
            <span *ngIf="offer.compensation">💶 {{ offer.compensation }}€/mois</span>
            <span>👥 {{ offer.applicationCount }} candidat(s)</span>
          </div>
          <div class="offer-footer">
            <span class="dates">{{ offer.startDate | date:'dd/MM/yyyy' }} → {{ offer.endDate | date:'dd/MM/yyyy' }}</span>
            <button (click)="openApplyModal(offer)" class="btn-apply"
                    [disabled]="appliedIds.has(offer.id)">
              {{ appliedIds.has(offer.id) ? '✓ Déjà postulé' : 'Postuler' }}
            </button>
          </div>
        </div>
      </div>

      <div class="empty" *ngIf="offers.length === 0 && !loading">Aucune offre trouvée.</div>
      <div class="loading" *ngIf="loading">Chargement...</div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button (click)="prevPage()" [disabled]="currentPage === 0">← Précédent</button>
        <span>Page {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">Suivant →</button>
      </div>
    </div>

    <!-- Apply Modal -->
    <div class="modal-backdrop" *ngIf="selectedOffer" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Postuler – {{ selectedOffer.title }}</h3>
        <p class="modal-company">{{ selectedOffer.companyName }}</p>
        <div class="form-group">
          <label>Lettre de motivation</label>
          <textarea [(ngModel)]="coverLetter" rows="6" placeholder="Décrivez votre motivation..."></textarea>
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
    .page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .filters { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-input { padding: 0.7rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; outline: none; flex: 1; min-width: 150px; }
    .filter-input:focus { border-color: #6366f1; }
    .btn-search { padding: 0.7rem 1.5rem; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 0.95rem; cursor: pointer; }
    .btn-reset { padding: 0.7rem 1.2rem; background: #f3f4f6; color: #374151; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; cursor: pointer; }
    .offers-grid { display: grid; gap: 1.2rem; }
    .offer-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border: 2px solid transparent; transition: border-color 0.2s; }
    .offer-card:hover { border-color: #6366f1; }
    .offer-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.8rem; }
    .offer-header h3 { margin: 0 0 0.3rem; color: #4f46e5; font-size: 1.1rem; }
    .company { font-size: 0.85rem; color: #6b7280; }
    .domain-tag { background: #dbeafe; color: #1d4ed8; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
    .description { color: #4b5563; font-size: 0.9rem; margin: 0 0 1rem; line-height: 1.5; }
    .offer-meta { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .offer-meta span { font-size: 0.82rem; color: #6b7280; }
    .offer-footer { display: flex; justify-content: space-between; align-items: center; }
    .dates { font-size: 0.82rem; color: #9ca3af; }
    .btn-apply { padding: 0.5rem 1.2rem; background: linear-gradient(135deg, #10b981, #10b981); color: white; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
    .btn-apply:disabled { background: #d1fae5; color: #10b981; cursor: default; }
    .empty, .loading { text-align: center; padding: 4rem; color: #9ca3af; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
    .pagination button { padding: 0.5rem 1.2rem; border: 2px solid #e5e7eb; background: white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 1rem; }
    .modal { background: white; border-radius: 16px; padding: 2rem; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; }
    .modal h3 { color: #4f46e5; margin: 0 0 0.3rem; }
    .modal-company { color: #6b7280; font-size: 0.9rem; margin: 0 0 1.5rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.7rem 1rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; outline: none; box-sizing: border-box; resize: vertical; }
    .form-group input:focus, .form-group textarea:focus { border-color: #10b981; }
    .error-msg { color: #dc2626; font-size: 0.85rem; margin-bottom: 1rem; }
    .modal-actions { display: flex; gap: 0.8rem; justify-content: flex-end; }
    .btn-cancel { padding: 0.7rem 1.5rem; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 0.95rem; }
    .btn-submit { padding: 0.7rem 1.5rem; background: linear-gradient(135deg, #10b981, #10b981); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 600; }
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
