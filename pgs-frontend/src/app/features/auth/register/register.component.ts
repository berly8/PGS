import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="auth-panel">
        <div class="panel-grid"></div>
        <div class="panel-content">
          <div class="brand">
            <div class="brand-mark">P</div>
            <span class="brand-name">PGS</span>
          </div>
          <h2>Rejoignez la plateforme</h2>
          <p>Créez votre compte et accédez à votre espace personnalisé selon votre rôle.</p>
          <div class="roles-list">
            <div class="role-item student">
              <div class="role-icon">🎓</div>
              <div class="role-text">
                <strong>Étudiant</strong>
                <span>Postulez aux offres</span>
              </div>
            </div>
            <div class="role-item company">
              <div class="role-icon">🏢</div>
              <div class="role-text">
                <strong>Entreprise</strong>
                <span>Publiez des offres</span>
              </div>
            </div>
            <div class="role-item supervisor">
              <div class="role-icon">👨‍🏫</div>
              <div class="role-text">
                <strong>Encadrant</strong>
                <span>Suivez les stages</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="form-wrap">
          <div class="form-header">
            <h1>Créer un compte</h1>
            <p class="form-sub">Remplissez les informations ci-dessous</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="row">
              <div class="field">
                <label>Prénom</label>
                <input formControlName="firstName" placeholder="Jean" />
              </div>
              <div class="field">
                <label>Nom</label>
                <input formControlName="lastName" placeholder="Dupont" />
              </div>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="vous@exemple.fr" />
            </div>
            <div class="field">
              <label>Mot de passe</label>
              <input type="password" formControlName="password" placeholder="••••••••" />
            </div>

            <div class="field role-field">
              <label>Rôle</label>
              <div class="role-cards">
                <label class="role-card" [class.active]="selectedRole === 'STUDENT'">
                  <input type="radio" value="STUDENT" formControlName="role" (change)="onRoleChange()" />
                  <span class="role-card-icon">🎓</span>
                  <span class="role-card-label">Étudiant</span>
                </label>
                <label class="role-card" [class.active]="selectedRole === 'COMPANY'">
                  <input type="radio" value="COMPANY" formControlName="role" (change)="onRoleChange()" />
                  <span class="role-card-icon">🏢</span>
                  <span class="role-card-label">Entreprise</span>
                </label>
                <label class="role-card" [class.active]="selectedRole === 'SUPERVISOR'">
                  <input type="radio" value="SUPERVISOR" formControlName="role" (change)="onRoleChange()" />
                  <span class="role-card-icon">👨‍🏫</span>
                  <span class="role-card-label">Encadrant</span>
                </label>
              </div>
              <!-- Radio inputs above handle role formControl binding -->
            </div>

            <div class="dynamic-fields" *ngIf="selectedRole">
              <div class="field" *ngIf="selectedRole === 'COMPANY'">
                <label>Nom de l'entreprise</label>
                <input formControlName="companyName" placeholder="Acme Corp" />
              </div>
              <div *ngIf="selectedRole === 'STUDENT'" class="row">
                <div class="field">
                  <label>N° étudiant</label>
                  <input formControlName="studentNumber" placeholder="ET-2024-001" />
                </div>
                <div class="field">
                  <label>Filière</label>
                  <input formControlName="program" placeholder="Génie Informatique" />
                </div>
              </div>
              <div class="field" *ngIf="selectedRole === 'SUPERVISOR'">
                <label>Département</label>
                <input formControlName="department" placeholder="Informatique" />
              </div>
            </div>

            <div class="global-err" *ngIf="errorMessage">{{ errorMessage }}</div>
            <button type="submit" class="submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Créer mon compte →</span>
              <span *ngIf="loading">Inscription...</span>
            </button>
          </form>

          <p class="switch-link">Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideFields {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .auth-shell { display: flex; min-height: 100vh; }

    .auth-panel {
      width: 42%; background: #0a0e1a; display: flex;
      align-items: center; justify-content: center; padding: 3.5rem;
      position: relative; overflow: hidden;
      animation: panelSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .panel-grid {
      position: absolute; inset: 0; opacity: 0.04;
      background-image:
        linear-gradient(rgba(76, 61, 206, 0.6) 1px, transparent 1px),
        linear-gradient(90deg, rgba(76, 61, 206, 0.6) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(ellipse at 60% 50%, black 20%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at 60% 50%, black 20%, transparent 70%);
    }

    .panel-content {
      max-width: 360px; position: relative; z-index: 1;
      animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
    }

    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 3.5rem; }
    .brand-mark {
      width: 44px; height: 44px; background: linear-gradient(135deg, #4c3dce, #6b5ce7);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.3rem; color: white;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      box-shadow: 0 4px 16px rgba(76, 61, 206, 0.35);
    }
    .brand-name {
      color: white; font-size: 1.4rem; font-weight: 700;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.02em;
    }

    .panel-content h2 {
      color: #ffffff; font-size: 1.65rem; font-weight: 700;
      line-height: 1.25; margin-bottom: 0.8rem;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.02em;
    }
    .panel-content p {
      color: #8892a8; font-size: 0.92rem; line-height: 1.6; margin-bottom: 2rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .roles-list { display: flex; flex-direction: column; gap: 0.6rem; }
    .role-item {
      display: flex; align-items: center; gap: 14px;
      padding: 0.75rem 1rem; border-radius: 10px; font-size: 0.85rem;
      transition: transform 0.25s ease, background 0.25s ease;
    }
    .role-item:hover { transform: translateX(4px); }
    .role-item.student { background: rgba(107, 144, 128, 0.15); }
    .role-item.company { background: rgba(194, 91, 58, 0.12); }
    .role-item.supervisor { background: rgba(76, 61, 206, 0.15); }
    .role-icon { font-size: 1.2rem; line-height: 1; }
    .role-text { display: flex; flex-direction: column; gap: 1px; }
    .role-text strong {
      color: #e2e0ea; font-size: 0.85rem; font-weight: 600;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }
    .role-text span {
      color: #7a8499; font-size: 0.78rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .auth-form-panel {
      flex: 1; display: flex; align-items: center;
      justify-content: center; padding: 2.5rem;
      background: #faf6f1; overflow-y: auto;
      background-image:
        radial-gradient(circle at 60% 20%, rgba(76, 61, 206, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(194, 91, 58, 0.02) 0%, transparent 40%);
    }

    .form-wrap {
      width: 100%; max-width: 460px; padding: 1rem 0;
      animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
    }

    .form-header { margin-bottom: 2rem; }

    h1 {
      font-size: 1.9rem; font-weight: 800; color: #0a0e1a; margin-bottom: 6px;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.03em;
    }
    .form-sub {
      color: #6b7280; font-size: 0.92rem; margin: 0;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }

    .field { margin-bottom: 1.1rem; }

    label {
      display: block; font-size: 0.82rem; font-weight: 600; color: #374151;
      margin-bottom: 0.4rem; letter-spacing: 0.01em;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    input, select {
      width: 100%; padding: 0.72rem 0.95rem; border: 1.5px solid #d9d2c9;
      border-radius: 10px; font-size: 0.9rem; outline: none; background: #ffffff;
      color: #0a0e1a;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
      box-sizing: border-box;
    }
    input::placeholder { color: #b0a99f; }
    input:focus, select:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 3.5px rgba(76, 61, 206, 0.1), 0 2px 8px rgba(76, 61, 206, 0.06);
      transform: translateY(-1px);
    }

    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }

    .role-field > label { margin-bottom: 0.6rem; }

    .role-cards {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem;
    }

    .role-card {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 1rem 0.5rem; border-radius: 12px;
      border: 1.5px solid #d9d2c9; background: #ffffff;
      cursor: pointer; text-align: center;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
    }
    .role-card input[type="radio"] {
      position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
    }
    .role-card:hover {
      border-color: #b5aee0;
      background: #f8f6fc;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(76, 61, 206, 0.08);
    }
    .role-card.active {
      border-color: #4c3dce;
      background: linear-gradient(135deg, #f3f0ff, #ece8fc);
      box-shadow: 0 4px 16px rgba(76, 61, 206, 0.15);
      transform: translateY(-2px);
    }
    .role-card-icon { font-size: 1.5rem; line-height: 1; }
    .role-card-label {
      font-size: 0.78rem; font-weight: 600; color: #374151;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }
    .role-card.active .role-card-label { color: #4c3dce; }

    .dynamic-fields {
      animation: slideFields 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
      margin-top: 0.2rem;
      padding-top: 0.5rem;
      border-top: 1px dashed #e4ddd4;
    }

    .global-err {
      background: #fdf0ec; border: 1px solid #f0c4b4; color: #a0432a;
      border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      animation: fadeInUp 0.3s ease both;
    }

    .submit-btn {
      width: 100%; padding: 0.85rem;
      background: linear-gradient(135deg, #4c3dce, #5a4ad8);
      color: white; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
      cursor: pointer; margin-top: 0.5rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      letter-spacing: 0.01em;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 4px 14px rgba(76, 61, 206, 0.25);
      position: relative; overflow: hidden;
    }
    .submit-btn::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1));
      opacity: 0; transition: opacity 0.3s ease;
    }
    .submit-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #3a2ea6, #4c3dce);
      box-shadow: 0 6px 20px rgba(76, 61, 206, 0.35);
      transform: translateY(-2px);
    }
    .submit-btn:hover:not(:disabled)::after { opacity: 1; }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

    .switch-link {
      text-align: center; margin-top: 1.4rem; color: #6b7280; font-size: 0.88rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }
    .switch-link a {
      color: #4c3dce; font-weight: 600;
      transition: color 0.2s ease;
      border-bottom: 1.5px solid transparent;
    }
    .switch-link a:hover {
      color: #3a2ea6;
      border-bottom-color: #3a2ea6;
    }

    @media (max-width: 768px) {
      .auth-shell { flex-direction: column; }
      .auth-panel { width: 100%; min-height: 30vh; padding: 2rem; }
      .auth-form-panel { padding: 2rem 1.5rem; }
      .role-cards { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  selectedRole = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      companyName: [''],
      studentNumber: [''],
      program: [''],
      department: ['']
    });
  }

  onRoleChange(): void {
    this.selectedRole = this.registerForm.get('role')?.value || '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.authService.redirectByRole(),
      error: err => {
        this.errorMessage = err.error?.message || "Erreur lors de l'inscription";
        this.loading = false;
      }
    });
  }
}
