import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: HttpParams | {[param: string]: string | string[]}, headers?: HttpHeaders | {[header: string]: string | string[]}): Observable<T> {
    return this.http.get<T>(url, { params, headers });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders | {[header: string]: string | string[]}): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  // Add other HTTP methods as needed (put, delete, etc.)
} 