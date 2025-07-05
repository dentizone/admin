import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../login/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  token:string |null;
  private apiUrl = 'https://apit.gitnasr.com/api/Users';
  constructor(private http:HttpClient,private authService:Login) {
    this.token=authService.getAccessToken();
   }

  getUsers(page: number,keyword?:string,status?:number ): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    let url=`${this.apiUrl}?Page=${page}`
    if(keyword){
      url=url+`&SearchTerm=${keyword}`
    }
    if(status!=null && status!=-1){
      url=url+`&Status=${status}`
    }
    return this.http.get(url, { headers });
  }

  getUserStats():Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get('https://apit.gitnasr.com/api/Users/stats',{headers})
  }
  updateUserStatus(userId: string, status: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}/state`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.patch(url, { status }, { headers });
  }
}
