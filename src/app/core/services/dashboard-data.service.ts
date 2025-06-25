import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from '../models/activity.model';
import { HttpService } from './http.service';
import { environment } from '../../../environments/environment';

export interface AnalyticsPostResponse {
  totalPosts: number;
  averagePostPrice: number;
  postsByCategory: { [category: string]: number };
  pendingPosts: number;
}

export interface AnalyticsUserResponse {
  totalUsers: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  usersByUniversity: { [university: string]: number };
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private readonly analyticsUrl = environment.analyticsPostUrl;
  private readonly analyticsUserUrl = environment.analyticsUserUrl;

  constructor(private readonly httpService: HttpService) {}

  getAnalyticsPost(): Observable<AnalyticsPostResponse> {
    return this.httpService.get<AnalyticsPostResponse>(this.analyticsUrl).pipe(
      catchError(error => {
        console.error('Error fetching analytics post data:', error);
        // Return a safe fallback value
        return of({
          totalPosts: 0,
          averagePostPrice: 0,
          postsByCategory: {},
          pendingPosts: 0
        });
      })
    );
  }

  getAnalyticsUser(): Observable<AnalyticsUserResponse> {
    return this.httpService.get<AnalyticsUserResponse>(this.analyticsUserUrl).pipe(
      catchError(error => {
        console.error('Error fetching analytics user data:', error);
        // Return a safe fallback value
        return of({
          totalUsers: 0,
          newUsersLast7Days: 0,
          newUsersLast30Days: 0,
          usersByUniversity: {}
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
