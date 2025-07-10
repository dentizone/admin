import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../login/login';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  api = 'https://apit.gitnasr.com/api/Posts';
  token: string | null;
  constructor(
    private readonly http: HttpClient,
    private readonly authService: Login
  ) {
    this.token = authService.getAccessToken();
  }

  getAllPosts(filters: any): Observable<any> {
    let params = [];
    if (filters.pageNumber) params.push(`PageNumber=${filters.pageNumber}`);
    if (filters.keyword)
      params.push(`Keyword=${encodeURIComponent(filters.keyword)}`);
    if (filters.city) params.push(`City=${encodeURIComponent(filters.city)}`);
    if (filters.category)
      params.push(`Category=${encodeURIComponent(filters.category)}`);
    if (filters.subCategory)
      params.push(`SubCategory=${encodeURIComponent(filters.subCategory)}`);
    if (filters.condition)
      params.push(`Condition=${encodeURIComponent(filters.condition)}`);
    if (filters.minPrice != null) params.push(`MinPrice=${filters.minPrice}`);
    if (filters.maxPrice != null) params.push(`MaxPrice=${filters.maxPrice}`);
    if (filters.sortBy)
      params.push(`SortBy=${encodeURIComponent(filters.sortBy)}`);
    if (filters.sortDirection !== undefined)
      params.push(`SortDirection=${filters.sortDirection}`);
    if (filters.postStatus) params.push(`PostStatus=${filters.postStatus}`);

    params.push('SkipCache=true');
    const query = params.length ? '?' + params.join('&') : '';
    const url = `https://apit.gitnasr.com/api/Posts/search${query}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(url, { headers });
  }
  changePostStatus(postID: string, status: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    let body = {
      postId: postID,
      status: status,
      reason: 'No Reason Provided',
    };
    let url = this.api + '/' + postID + '/status';
    return this.http.patch(url, body, { headers });
  }

  getPostStats(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get('https://apit.gitnasr.com/api/Posts/stats', {
      headers,
    });
  }
  getFilters():Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get('https://apit.gitnasr.com/api/Posts/sidebar',{headers})
  }
  getSubcategories(id:string):Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(`https://apit.gitnasr.com/api/Catalog/categories/${id}/subcategories`,{headers})
  }
}
