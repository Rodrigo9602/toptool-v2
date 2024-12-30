import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthTokenService } from './auth-token.service';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser$ = this.currentUserSubject.asObservable();

  private headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private url: string = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private authTokenService: AuthTokenService) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, { email, password })
      .pipe(
        tap(response => {
          this.authTokenService.setToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }


  register(user: Partial<User>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/register`, user)
      .pipe(
        tap(response => {
          this.authTokenService.setToken(response.token);
          this.currentUserSubject.next(response.user);
        })
      );
  }


  changePassword(passwordData: String): Observable<void> {
    return this.http.post<void>(`${this.url}/change-password`, passwordData);
  }


  recover(email: string): Observable<any> {
    return this.http.post<any>(
      this.url + 'recover',
      { email },
      { headers: this.headers }
    );
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value.role === 'admin';
  }

  logout(): void {
    this.authTokenService.setToken(null);
    this.currentUserSubject.next({} as User);
  }
}
