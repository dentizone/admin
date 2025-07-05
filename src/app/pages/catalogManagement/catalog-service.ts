import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../login/login';
@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  token:string |null;
  constructor(private http:HttpClient,private authService:Login) {
    this.token=authService.getAccessToken();
  }

  getAllCategories():Observable<any>{

    const url='https://apit.gitnasr.com/api/Catalog/categories';
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url,{headers});
  }

  getSubCategories(id:string):Observable<any>{
    const url=`https://apit.gitnasr.com/api/Catalog/categories/${id}/subcategories`;
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(url,{headers});
  }

  uploadImage(file:File):Observable<any>{
    const url='https://apit.gitnasr.com/api/Upload/image';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(url, formData,{headers});
  }
  updateCategoryData(iconUrl:string,name:string,categoryID:string):Observable<any>{
    const url=`https://apit.gitnasr.com/api/Catalog/categories/${categoryID}`;
    let body={
      name:name,
      iconUrl:iconUrl
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put(url,body,{headers});
  }
  addSubcategory(categoryID:string,newSubName:string):Observable<any>{
    const url='https://apit.gitnasr.com/api/Catalog/subcategories';
    let body={
      name: newSubName,
      categoryId: categoryID
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(url,body,{headers})
  }

  addNewCategory(name:string,iconUrl:string):Observable<any>{
    const url='https://apit.gitnasr.com/api/Catalog/categories'

    let body={
      name: name,
      iconUrl: iconUrl
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(url,body,{headers})
  }
  removeSubcategory(subID:string):Observable<any>{
    const url=`https://apit.gitnasr.com/api/Catalog/subcategories/${subID}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.delete(url,{headers})
  }

  removeCategory(categoryId:string):Observable<any>{
    const url=`https://apit.gitnasr.com/api/Catalog/categories/${categoryId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.delete(url,{headers});
  }
}
