import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PostCategory } from '../models/post-category.model';
import { Activity } from '../models/activity.model';
import { HttpService } from './http.service';

export interface AnalyticsPostResponse {
  totalPosts: number;
  averagePostPrice: number;
  postsByCategory: { [category: string]: number };
}

export interface AnalyticsUserResponse {
  totalUsers: number;
  newUsersLast7Days: number;
  newUsersLast30Days: number;
  usersByUniversity: { [university: string]: number };
}

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  private analyticsUrl = 'https://apit.gitnasr.com/api/Analytics/post';
  private analyticsUserUrl = 'https://apit.gitnasr.com/api/Analytics/user';

  constructor(private httpService: HttpService) {}

  getAnalyticsPost(): Observable<AnalyticsPostResponse> {
    return this.httpService.get<AnalyticsPostResponse>(this.analyticsUrl);
  }

  getAnalyticsUser(): Observable<AnalyticsUserResponse> {
    return this.httpService.get<AnalyticsUserResponse>(this.analyticsUserUrl);
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
