import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../login/login';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  api='https://apit.gitnasr.com/api/Posts';
  token:string|null;
  constructor(private http:HttpClient,private authService:Login) {
      this.token=authService.getAccessToken();
     }
  
  getAllPosts(pageNum:number,keyword:string):Observable<any>{
    const url=`https://apit.gitnasr.com/api/Posts/search?PageNumber=${pageNum}&Keyword=${keyword}`
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.get(url,{headers});
  }
  changePostStatus(postID:string,status:number):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    let body={
      postId:postID,
      status:status,
      reason:'Beacause'
    }
    let url=this.api+'/'+postID+'/status';
    return this.http.patch(url,body,{headers})
  }
}
