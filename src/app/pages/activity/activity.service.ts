import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivityApiResponse,
  UserActivities,
} from '../../core/models/activity.model';
import { HttpService } from '../../core/services/http.service';

export interface ActivityFilter {
  userId?: string;
  device?: string;
  ipAddress?: string;
  activityType?: UserActivities;
  detectedAfter?: string;
  detectedBefore?: string;
  searchText?: string;
  pageNumber?: number;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private readonly apiUrl = '/api/Activity';

  constructor(private readonly http: HttpService) {}

  getActivities(filter: ActivityFilter = {}): Observable<ActivityApiResponse> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value as string);
      }
    });
    return this.http.get<ActivityApiResponse>(this.apiUrl, params);
  }
}
