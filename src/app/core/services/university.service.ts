import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { University, CreateUniversityDto, UpdateUniversityDto, PagedResultDto } from '../models/university.model';

@Injectable({ providedIn: 'root' })
export class UniversityService {
  private readonly baseUrl = 'https://apit.gitnasr.com/api/Universities';

  constructor(private readonly http: HttpClient) {}

  getAll(page: number = 1, pageSize: number = 10): Observable<PagedResultDto<University>> {
    return this.http.get<PagedResultDto<University>>(`${this.baseUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getSupported(page: number = 1, pageSize: number = 10): Observable<PagedResultDto<University>> {
    return this.http.get<PagedResultDto<University>>(`${this.baseUrl}/supported?page=${page}&pageSize=${pageSize}`);
  }

  getById(id: string): Observable<University> {
    return this.http.get<University>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateUniversityDto): Observable<University> {
    return this.http.post<University>(this.baseUrl, dto);
  }

  update(id: string, dto: UpdateUniversityDto): Observable<University> {
    return this.http.put<University>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
} 