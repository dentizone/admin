import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Activity, ActivityApiResponse } from '../models/activity.model';
import { HttpService } from './http.service';

export interface AnalyticsResponse {
  userAnalytics: {
    totalUsers: number;
    newUsersLast7Days: number;
    newUsersLast30Days: number;
    pendingKyc: number;
    usersByUniversity: { [university: string]: number };
  };
  postAnalytics: {
    totalPosts: number;
    pendingPosts: number;
    activePosts: number;
    averagePostPrice: number;
    postsByCategory: { [category: string]: number };
  };
  salesAnalytics: {
    totalSalesRevenue: number;
    totalsOrder: number;
    averagePostPrice: number;
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly analyticsUrl = environment.analyticsUrl;

  constructor(private readonly httpService: HttpService) {}

  getAnalytics(): Observable<AnalyticsResponse> {
    return this.httpService.get<AnalyticsResponse>(this.analyticsUrl).pipe(
      catchError((error) => {
        console.error('Error fetching analytics data:', error);
        // Return a safe fallback value
        return of({
          userAnalytics: {
            totalUsers: 0,
            newUsersLast7Days: 0,
            newUsersLast30Days: 0,
            pendingKyc: 0,
            usersByUniversity: {},
          },
          postAnalytics: {
            totalPosts: 0,
            pendingPosts: 0,
            activePosts: 0,
            averagePostPrice: 0,
            postsByCategory: {},
          },
          salesAnalytics: {
            totalSalesRevenue: 0,
            totalsOrder: 0,
            averagePostPrice: 0,
          },
        });
      })
    );
  }

  getRecentActivities(): Observable<Activity[]> {
    // Fetch top 5 activities from the Activity API
    return this.httpService
      .get<ActivityApiResponse>('https://apit.gitnasr.com/api/Activity', {
        pageNumber: '1',
        pageSize: '5',
      })
      .pipe(map((res) => res.items.slice(0, 5)));
  }
}
