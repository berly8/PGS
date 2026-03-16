import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { OfferService } from '../../../core/services/offer.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Offer } from '../../../core/models/offer.model';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent],
  template: `
    <div class="app-layout"><app-sidebar /><div class="app-content">
    <div class="page">
      <div class="page-header">
        <h2>Tableau de bord Entreprise 🏢</h2>
        <p>Gérez vos offres et candidatures</p>
      </div>

      <div class="stats-row">
        <div class="stat-card"><div class="stat-val">{{ offers.length }}</div><div class="stat-lbl">Offres publiées</div></div>
        <div class="stat-card"><div class="stat-val">{{ openOffers }}</div><div class="stat-lbl">Offres ouvertes</div></div>
        <div class="stat-card"><div class="stat-val">{{ totalApps }}</div><div class="stat-lbl">Candidatures reçues</div></div>
        <div class="stat-card"><div class="stat-val">{{ pendingApps }}</div><div class="stat-lbl">En attente</div></div>
      </div>

      <div class="quick-links">
        <a routerLink="/company/offers" class="link-card">
          <span>📋</span><strong>Gérer mes offres</strong><p>Créer, modifier, fermer des offres</p>
        </a>
        <a routerLink="/company/candidatures" class="link-card">
          <span>👥</span><strong>Voir les candidatures</strong><p>Accepter ou refuser des candidats</p>
        </a>
      </div>

      <div class="section" *ngIf="offers.length > 0">
        <h3>Mes offres récentes</h3>
        <div class="offers-list">
          <div class="offer-row" *ngFor="let o of offers.slice(0,5)">
            <div>
              <strong>{{ o.title }}</strong>
              <span>{{ o.location }} | {{ o.durationWeeks }} semaines</span>
            </div>
            <div class="offer-meta">
              <span class="app-count">{{ o.applicationCount }} candidat(s)</span>
              <span class="status-badge" [class]="'status-' + o.status.toLowerCase()">{{ o.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div></div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h2 { font-size: 1.8rem; color: #4f46e5; margin: 0 0 0.3rem; }
    .page-header p { color: #6b7280; margin: 0; }
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: white; border-radius: 10px; padding: 1.2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .stat-val { font-size: 2rem; font-weight: 800; color: #f59e0b; }
    .stat-lbl { font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem; }
    .quick-links { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
    .link-card { background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 1.5rem; text-decoration: none; color: inherit; transition: all 0.2s; display: block; }
    .link-card:hover { border-color: #f59e0b; box-shadow: 0 4px 12px rgba(217,119,6,0.15); }
    .link-card span { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
    .link-card strong { display: block; color: #4f46e5; }
    .link-card p { margin: 0.2rem 0 0; color: #6b7280; font-size: 0.85rem; }
    .section h3 { font-size: 1.1rem; color: #4f46e5; margin-bottom: 1rem; }
    .offers-list { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
    .offer-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9; }
    .offer-row:last-child { border-bottom: none; }
    .offer-row strong { display: block; color: #4f46e5; font-size: 0.9rem; }
    .offer-row span { font-size: 0.8rem; color: #6b7280; }
    .offer-meta { display: flex; align-items: center; gap: 0.8rem; }
    .app-count { font-size: 0.82rem; color: #6b7280; }
    .status-badge { padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .status-open { background: #d1fae5; color: #10b981; }
    .status-closed { background: #fee2e2; color: #dc2626; }
    .status-expired { background: #f3f4f6; color: #6b7280; }
  `]
})
export class CompanyDashboardComponent implements OnInit {
  offers: Offer[] = [];
  totalApps = 0;
  pendingApps = 0;

  get openOffers(): number { return this.offers.filter(o => o.status === 'OPEN').length; }

  constructor(public auth: AuthService, private offerService: OfferService, private appService: ApplicationService) {}

  ngOnInit(): void {
    if (this.auth.currentUser?.id) {
      this.offerService.getOffersByCompany(this.auth.currentUser.id).subscribe({ next: o => this.offers = o, error: () => {} });
      this.appService.getCompanyApplications().subscribe({ next: apps => {
        this.totalApps = apps.length;
        this.pendingApps = apps.filter((a: any) => a.status === 'PENDING').length;
      }, error: () => {} });
    }
  }
}
