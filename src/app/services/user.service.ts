import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.API_URL_CORE;

  constructor(private http: HttpClient) { }

  getUsers() {
    return new Observable((observer) => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-token', localStorage.getItem('authToken') || '');
      this.http.get(`${this.API_URL}/users`, { headers }).subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        },
      });
    });
  }

  createUser(user: any) {
    return new Observable((observer) => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-token', localStorage.getItem('authToken') || '');
      this.http.post(`${this.API_URL}/users`, user, { headers }).subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        },
      });
    });
  }

  updateUser(user: any) {
    return new Observable((observer) => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-token', localStorage.getItem('authToken') || '');
      this.http.put(`${this.API_URL}/users/${user.id}`, user, { headers }).subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        },
      });
    });
  }

  changeUserState(userId: string, newState: boolean) {
    return new Observable((observer) => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-token', localStorage.getItem('authToken') || '');
      this.http.patch(`${this.API_URL}/users/${userId}`, { state: newState }, { headers }).subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        },
      });
    });
  }

  deleteUser(userId: any) {
    return new Observable((observer) => {
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('x-token', localStorage.getItem('authToken') || '');
      this.http.delete(`${this.API_URL}/users/${userId}`, { headers }).subscribe({
        next: (response: any) => {
          observer.next(response);
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        },
      });
    });
  }

}
