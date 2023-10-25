import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL_CORE;
  private TOKEN_KEY = 'authToken';
  public isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  isAuthenticated$(): Observable<boolean> {
    return this.isLoggedIn;
  }

  login(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.API_URL}/auth/login`, { email, password }).subscribe({
        next: (response: any) => {
          // Save the new token to local storage
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isLoggedIn.next(true);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  validateJWT(savedToken: string): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.API_URL}/auth/validate-token`, { token: savedToken }).subscribe({
        next: (response: any) => {
          this.isLoggedIn.next(true);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  register(newUser: any): Observable<any> {
    return new Observable((observer) => {
      this.http.post(`${this.API_URL}/auth/register`, newUser).subscribe({
        next: (response: any) => {
          // Save the new token to local storage
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.isLoggedIn.next(true);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

}
