import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-shell">
      <div class="auth-panel">
        <div class="geo-shapes">
          <div class="geo geo-1"></div>
          <div class="geo geo-2"></div>
          <div class="geo geo-3"></div>
          <div class="geo geo-4"></div>
          <div class="geo geo-5"></div>
        </div>
        <div class="panel-content">
          <div class="brand">
            <div class="brand-mark">P</div>
            <span class="brand-name">PGS</span>
          </div>
          <h2>Gérez vos stages en toute simplicité</h2>
          <p>Une plateforme unifiée pour étudiants, entreprises et encadrants.</p>
          <div class="features">
            <div class="feature"><span class="feat-dot"></span>Offres centralisées</div>
            <div class="feature"><span class="feat-dot"></span>Suivi en temps réel</div>
            <div class="feature"><span class="feat-dot"></span>Accès sécurisé par rôle</div>
          </div>
        </div>
      </div>

      <div class="auth-form-panel">
        <div class="form-wrap">
          <div class="form-header">
            <h1>Connexion</h1>
            <p class="form-sub">Accédez à votre espace !!!</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="field">
              <label>Adresse email</label>
              <div class="input-wrap">
                <input type="email" formControlName="email" placeholder="vous@exemple.fr"
                       [class.invalid]="isInvalid('email')" />
              </div>
              <span class="err" *ngIf="isInvalid('email')">Email invalide</span>
            </div>
            <div class="field">
              <label>Mot de passe</label>
              <div class="input-wrap">
                <input type="password" formControlName="password" placeholder="••••••••"
                       [class.invalid]="isInvalid('password')" />
              </div>
              <span class="err" *ngIf="isInvalid('password')">Mot de passe requis</span>
            </div>
            <div class="global-err" *ngIf="errorMessage">{{ errorMessage }}</div>
            <button type="submit" class="submit-btn" [disabled]="loading">
              <span *ngIf="!loading">Se connecter →</span>
              <span *ngIf="loading">Connexion en cours...</span>
            </button>
          </form>

          <p class="switch-link">Pas encore de compte ? <a routerLink="/auth/register">Créer un compte</a></p>

          <div class="demo-hint">
            <span>Démo admin :</span> admin&#64;pgs.com / admin123
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes floatGeo {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(8px, -12px) rotate(6deg); }
    }
    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateX(-30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .auth-shell { display: flex; min-height: 100vh; }

    .auth-panel {
      width: 44%; background: #0a0e1a; display: flex;
      align-items: center; justify-content: center; padding: 3.5rem;
      position: relative; overflow: hidden;
      animation: panelSlideIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .geo-shapes { position: absolute; inset: 0; pointer-events: none; }
    .geo {
      position: absolute; border-radius: 4px; opacity: 0.07;
      animation: floatGeo 12s ease-in-out infinite;
    }
    .geo-1 {
      width: 120px; height: 120px; border: 2px solid #4c3dce;
      top: 8%; left: -20px; transform: rotate(15deg);
      animation-delay: 0s;
    }
    .geo-2 {
      width: 60px; height: 60px; background: #c25b3a;
      top: 20%; right: 12%; border-radius: 50%;
      animation-delay: -3s;
    }
    .geo-3 {
      width: 200px; height: 200px; border: 2px solid #6b9080;
      bottom: 15%; right: -40px; transform: rotate(45deg);
      animation-delay: -6s;
    }
    .geo-4 {
      width: 40px; height: 40px; background: #4c3dce;
      bottom: 30%; left: 15%; border-radius: 50%;
      animation-delay: -2s;
    }
    .geo-5 {
      width: 80px; height: 80px; border: 2px solid #c25b3a;
      top: 55%; left: 40%; transform: rotate(30deg);
      animation-delay: -8s;
    }

    .panel-content {
      max-width: 360px; position: relative; z-index: 1;
      animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
    }

    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 3.5rem; }
    .brand-mark {
      width: 44px; height: 44px; background: linear-gradient(135deg, #4c3dce, #6b5ce7);
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.3rem; color: white;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      box-shadow: 0 4px 16px rgba(76, 61, 206, 0.35);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .brand-mark:hover {
      transform: scale(1.08) rotate(-3deg);
      box-shadow: 0 6px 24px rgba(76, 61, 206, 0.45);
    }
    .brand-name {
      color: white; font-size: 1.4rem; font-weight: 700;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.02em;
    }

    .panel-content h2 {
      color: #ffffff; font-size: 1.75rem; font-weight: 700;
      line-height: 1.25; margin-bottom: 1rem;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.02em;
    }
    .panel-content p {
      color: #8892a8; font-size: 0.95rem; line-height: 1.65; margin-bottom: 2.5rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .features { display: flex; flex-direction: column; gap: 0.75rem; }
    .feature {
      display: flex; align-items: center; gap: 12px; color: #a0abbe;
      font-size: 0.9rem; font-weight: 500;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      transition: color 0.25s ease, transform 0.25s ease;
    }
    .feature:hover { color: #d4d9e3; transform: translateX(4px); }
    .feat-dot {
      width: 8px; height: 8px; background: #4c3dce; border-radius: 50%; flex-shrink: 0;
      box-shadow: 0 0 8px rgba(76, 61, 206, 0.5);
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }
    .feature:hover .feat-dot {
      background: #c25b3a;
      box-shadow: 0 0 10px rgba(194, 91, 58, 0.5);
    }

    .auth-form-panel {
      flex: 1; display: flex; align-items: center;
      justify-content: center; padding: 2.5rem;
      background: #faf6f1;
      background-image:
        radial-gradient(circle at 70% 30%, rgba(76, 61, 206, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 30% 80%, rgba(194, 91, 58, 0.03) 0%, transparent 40%);
    }

    .form-wrap {
      width: 100%; max-width: 420px;
      animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
    }

    .form-header { margin-bottom: 2.5rem; }

    h1 {
      font-size: 2rem; font-weight: 800; color: #0a0e1a; margin-bottom: 6px;
      font-family: var(--font-heading, 'Bricolage Grotesque', serif);
      letter-spacing: -0.03em;
    }
    .form-sub {
      color: #6b7280; font-size: 0.92rem; margin: 0;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .field {
      margin-bottom: 1.4rem;
      animation: fadeInUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .field:nth-child(1) { animation-delay: 0.45s; }
    .field:nth-child(2) { animation-delay: 0.55s; }

    label {
      display: block; font-size: 0.84rem; font-weight: 600; color: #374151;
      margin-bottom: 0.45rem; letter-spacing: 0.01em;
      font-family: var(--font-body, 'DM Sans', sans-serif);
    }

    .input-wrap { position: relative; }

    input {
      width: 100%; padding: 0.8rem 1rem; border: 1.5px solid #d9d2c9;
      border-radius: 10px; font-size: 0.95rem; outline: none;
      background: #ffffff; color: #0a0e1a;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
      box-sizing: border-box;
    }
    input::placeholder { color: #b0a99f; }
    input:focus {
      border-color: #4c3dce;
      box-shadow: 0 0 0 3.5px rgba(76, 61, 206, 0.1), 0 2px 8px rgba(76, 61, 206, 0.06);
      transform: translateY(-1px);
    }
    input.invalid {
      border-color: #c25b3a;
      box-shadow: 0 0 0 3px rgba(194, 91, 58, 0.1);
    }

    .err {
      color: #c25b3a; font-size: 0.78rem; margin-top: 5px; display: block;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      font-weight: 500;
    }

    .global-err {
      background: #fdf0ec; border: 1px solid #f0c4b4; color: #a0432a;
      border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1.2rem;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      animation: fadeInUp 0.3s ease both;
    }

    .submit-btn {
      width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #4c3dce, #5a4ad8);
      color: white; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600;
      cursor: pointer;
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
      text-align: center; margin-top: 1.8rem; color: #6b7280; font-size: 0.88rem;
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

    .demo-hint {
      margin-top: 1.5rem; padding: 0.8rem 1.1rem;
      background: rgba(76, 61, 206, 0.04);
      border-radius: 10px; font-size: 0.8rem; color: #6b7280; text-align: center;
      border: 1px dashed #d1cbc2;
      font-family: var(--font-body, 'DM Sans', sans-serif);
      transition: border-color 0.3s ease, background 0.3s ease;
    }
    .demo-hint:hover {
      border-color: #4c3dce;
      background: rgba(76, 61, 206, 0.06);
    }
    .demo-hint span { font-weight: 600; color: #0a0e1a; }

    @media (max-width: 768px) {
      .auth-shell { flex-direction: column; }
      .auth-panel { width: 100%; min-height: 35vh; padding: 2rem; }
      .auth-form-panel { padding: 2rem 1.5rem; }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  private readonly roleRoutes: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    STUDENT: '/student/dashboard',
    COMPANY: '/company/dashboard',
    SUPERVISOR: '/supervisor/dashboard'
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // If already logged in, go to dashboard (only once, no loop)
    if (this.authService.isLoggedIn() && this.authService.role) {
      const route = this.roleRoutes[this.authService.role];
      if (route) {
        this.router.navigateByUrl(route, { replaceUrl: true });
      }
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        const route = this.roleRoutes[res.role] || '/auth/login';
        this.router.navigateByUrl(route, { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        if (err.name === 'TimeoutError') {
          this.errorMessage = 'Le serveur met trop de temps à répondre. Vérifiez que le backend est lancé.';
        } else if (err.status === 0) {
          this.errorMessage = 'Impossible de contacter le serveur. Vérifiez que le backend tourne sur le port 8080.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else if (err.status >= 500) {
          this.errorMessage = 'Erreur serveur. Consultez les logs du backend.';
        } else {
          this.errorMessage = err.error?.message || 'Une erreur est survenue.';
        }
        console.error('Login error:', err);
      }
    });
  }
}
