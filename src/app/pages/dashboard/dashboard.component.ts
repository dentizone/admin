import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from "../../shared/components/card/card";
import { CardDetails } from '../../core/models/card.model';
import { RecentActivityComponent } from './recent-activity.component';
import { ChartComponent } from './chart.component';
import { PostCategory } from '../../core/models/post-category.model';
import { DASHBOARD_ICONS } from '../../core/constants/dashboard-icons';
import { DashboardDataService, AnalyticsPostResponse } from '../../core/services/dashboard-data.service';

const CATEGORY_COLORS = [
  '#3B82F6', // blue
  '#A78BFA', // purple
  '#EC4899', // pink
  '#F59E0B', // yellow
  '#10B981', // green
  '#F87171', // red
  '#6366F1', // indigo
  '#F472B6', // rose
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Card, ChartComponent, RecentActivityComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  DashboardCards: CardDetails[] = [
    {
      title: 'Total Users',
      value: 0,
      icon: DASHBOARD_ICONS.totalUsers,
    },
    {
      title: 'New Signups',
      value: 0,
     
      icon: DASHBOARD_ICONS.newSignups,
    },
    {
      title: 'Total Revenue',
      value: '$45,340',
     
      icon: DASHBOARD_ICONS.totalRevenue,
    },
    {
      title: 'Total Posts',
      value: 0,
     
      icon: DASHBOARD_ICONS.totalPosts,
 
    },
    {
      title: 'Pending Posts',
      value: -1,
    
     
      icon: DASHBOARD_ICONS.pendingPosts,
     
    },
    {
      title: 'Pending KYC',
      value: 40,
     
      icon: DASHBOARD_ICONS.pendingKyc,
     
    }
  ];

  postCategories: PostCategory[] = [];
  averagePostPrice: number | null = null;
  usersByUniversity: { [university: string]: number } = {};
  universityPieData: PostCategory[] = [];
  pendingPosts: number = 0;
  pendingKyc: number = 0;

  constructor(private dashboardDataService: DashboardDataService) {}

  ngOnInit(): void {
    this.dashboardDataService.getAnalyticsPost().subscribe((data: AnalyticsPostResponse) => {
      // Update Total Posts card
      const totalPostsCard = this.DashboardCards.find(card => card.title === 'Total Posts');
      if (totalPostsCard) {
        totalPostsCard.value = data.totalPosts;
      }
      this.averagePostPrice = data.averagePostPrice;
      // Transform postsByCategory to PostCategory[]
      const categories = Object.entries(data.postsByCategory);
      this.postCategories = categories.map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
      }));
      
      const pendingPostsCard = this.DashboardCards.find(card => card.title === 'Pending Posts');
      if (pendingPostsCard) {
        pendingPostsCard.value = data.pendingPosts;
      }
      // const pendingKycCard = this.DashboardCards.find(card => card.title === 'Pending KYC');
      // if (pendingKycCard) {
      //   pendingKycCard.value = data.pendingKyc;
      // }
      
    });
    this.dashboardDataService.getAnalyticsUser().subscribe(userData => {
      // Update Total Users card
      const totalUsersCard = this.DashboardCards.find(card => card.title === 'Total Users');
      if (totalUsersCard) {
        totalUsersCard.value = userData.totalUsers;
      }
      this.usersByUniversity = userData.usersByUniversity;
      // Transform for pie chart
      const universities = Object.entries(userData.usersByUniversity);
      this.universityPieData = universities.map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length]
      }));
    });
  }
}
