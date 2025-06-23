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
      value: 3254,
      change: '+12%',
      changeLabel: 'vs. previous month',
      icon: DASHBOARD_ICONS.totalUsers,
      changeType: 'positive'
    },
    {
      title: 'New Signups',
      value: 830,
      change: '-5%',
      changeLabel: 'vs. previous month',
      icon: DASHBOARD_ICONS.newSignups,
      changeType: 'negative'
    },
    {
      title: 'Total Revenue',
      value: '$45,340',
      change: '+40%',
      changeLabel: 'vs. previous month',
      icon: DASHBOARD_ICONS.totalRevenue,
      changeType: 'positive'
    },
    {
      title: 'Total Posts',
      value: 0, // will be set from API
      change: '+8%',
      changeLabel: 'vs. previous month',
      icon: DASHBOARD_ICONS.totalPosts,
      changeType: 'positive'
    },
    {
      title: 'Pending Posts',
      value: 25,
      change: '-2%',
      changeLabel: 'requires moderation',
      icon: DASHBOARD_ICONS.pendingPosts,
      changeType: 'negative'
    },
    {
      title: 'Pending KYC',
      value: 40,
      change: '+23%',
      changeLabel: 'requires attention',
      icon: DASHBOARD_ICONS.pendingKyc,
      changeType: 'positive'
    }
  ];

  postCategories: PostCategory[] = [];
  averagePostPrice: number | null = null;
  usersByUniversity: { [university: string]: number } = {};
  universityPieData: PostCategory[] = [];

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
