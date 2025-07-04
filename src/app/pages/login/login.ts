import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  academicYear: number;
  nationalId?: number;
  kycStatus: KycStatus;
  status: UserState;
  universityName?: string;
}
export enum KycStatus {
  Pending = 1,
  InProgress = 2,
  Approved = 3,
  Rejected = 4,
  Expired = 5,
  Cancelled = 6,
  Suspended = 7
}

export enum UserState {
  Active = 0,
  Inactive = 1,
  Blocked = 2,
  Deleted = 3,
  Pending = 4,
  Suspended = 5
} 
@Injectable({
  providedIn: 'root'
})
export class Login {

  constructor(private http:HttpClient) {
    this.loadStoredUser();
   }
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private loadStoredUser(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  checkLogin(email:string, password:string):Observable<any>{
    const url='https://apit.gitnasr.com/api/auth/login';

    const body={
      "email": email,
      "password": password
    }
    return this.http.post(url,body);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}
