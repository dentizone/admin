import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Activity } from '../models/activity.model';
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
    return of([
      {
        id: 1,
        type: 'register',
        title: 'Sarah Johnson registered as a new user',
        timestamp: new Date(Date.now() - 2 * 3600_000),
      },
      {
        id: 2,
        type: 'newPost',
        title: 'Michael Chen created a new post: "Dental Drill for Sale"',
        timestamp: new Date(Date.now() - 3 * 3600_000),
      },
      {
        id: 3,
        type: 'purchase',
        title: 'Emma Wilson made a high-value purchase',
        amount: 1250,
        timestamp: new Date(Date.now() - 5 * 3600_000),
      },
      {
        id: 4,
        type: 'withdrawal',
        title: 'Alex Rodriguez requested a withdrawal',
        amount: 750,
        timestamp: new Date(Date.now() - 6 * 3600_000),
      },
      {
        id: 5,
        type: 'report',
        title: 'John Smith reported a post for inappropriate content',
        timestamp: new Date(Date.now() - 8 * 3600_000),
      },
    ]);
  }
}
