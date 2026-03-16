import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtResponse, LoginRequest, RegisterRequest, Role } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'pgs_token';
  private readonly USER_KEY = 'pgs_user';

  private currentUserSubject = new BehaviorSubject<JwtResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      timeout(10000),
      tap(response => this.storeSession(response))
    );
  }

  register(data: RegisterRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => this.storeSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get currentUser(): JwtResponse | null {
    return this.currentUserSubject.value;
  }

  get role(): Role | null {
    return this.currentUser?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(...roles: Role[]): boolean {
    return !!this.role && roles.includes(this.role);
  }

  redirectByRole(): void {
    const routes: Record<Role, string> = {
      ADMIN: '/admin/dashboard',
      STUDENT: '/student/dashboard',
      COMPANY: '/company/dashboard',
      SUPERVISOR: '/supervisor/dashboard'
    };
    if (this.role) this.router.navigate([routes[this.role]]);
  }

  private storeSession(response: JwtResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response));
    this.currentUserSubject.next(response);
  }

  private loadUser(): JwtResponse | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}
