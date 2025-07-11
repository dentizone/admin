import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DASHBOARD_ICONS } from '../../core/constants/dashboard-icons';
import { CardDetails } from '../../core/models/card.model';
import { PostCategory } from '../../core/models/post-category.model';
import { DashboardDataService } from '../../core/services/dashboard-data.service';
import { Card } from '../../shared/components/card/card';
import { ChartComponent } from './chart.component';
import { RecentActivityComponent } from './recent-activity.component';

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
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  DashboardCards: CardDetails[] = [
    {
      title: 'Total Users',
      value: 0,
      icon: DASHBOARD_ICONS.totalUsers,
    },
    {
      title: 'Average Post Price',
      value: 'EGP 0',
      icon: DASHBOARD_ICONS.totalRevenue, // You may want a new icon for this
    },
    {
      title: 'Total Revenue',
      value: 'EGP 0',
      icon: DASHBOARD_ICONS.totalRevenue,
    },
    {
      title: 'Total Posts',
      value: 0,
      icon: DASHBOARD_ICONS.totalPosts,
    },
    {
      title: 'Pending Posts',
      value: 0,
      icon: DASHBOARD_ICONS.pendingPosts,
    },
    {
      title: 'Pending KYC',
      value: 0,
      icon: DASHBOARD_ICONS.pendingKyc,
    },
  ];

  postCategories: PostCategory[] = [];
  averagePostPrice: number | null = null;
  usersByUniversity: { [university: string]: number } = {};
  universityPieData: PostCategory[] = [];
  pendingPosts: number = 0;
  pendingKyc: number = 0;

  constructor(private readonly dashboardDataService: DashboardDataService) {}

  ngOnInit(): void {
    this.dashboardDataService.getAnalytics().subscribe((data) => {
      // User Analytics
      const user = data.userAnalytics;
      const post = data.postAnalytics;
      const sales = data.salesAnalytics;
      // Update cards
      const totalUsersCard = this.DashboardCards.find(
        (card) => card.title === 'Total Users'
      );
      if (totalUsersCard) totalUsersCard.value = user.totalUsers;
      const avgPostPriceCard = this.DashboardCards.find(
        (card) => card.title === 'Average Post Price'
      );
      if (avgPostPriceCard)
        avgPostPriceCard.value = `EGP ${sales.averagePostPrice.toLocaleString()}`;
      const totalRevenueCard = this.DashboardCards.find(
        (card) => card.title === 'Total Revenue'
      );
      if (totalRevenueCard)
        totalRevenueCard.value = `EGP ${sales.totalSalesRevenue.toLocaleString(
          undefined,
          { maximumFractionDigits: 2 }
        )}`;
      const totalPostsCard = this.DashboardCards.find(
        (card) => card.title === 'Total Posts'
      );
      if (totalPostsCard) totalPostsCard.value = post.totalPosts;
      const pendingPostsCard = this.DashboardCards.find(
        (card) => card.title === 'Pending Posts'
      );
      if (pendingPostsCard) pendingPostsCard.value = post.pendingPosts;
      const pendingKycCard = this.DashboardCards.find(
        (card) => card.title === 'Pending KYC'
      );
      if (pendingKycCard) pendingKycCard.value = user.pendingKyc;

      // Pie chart for posts by category
      const categories = Object.entries(post.postsByCategory);
      this.postCategories = categories.map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }));
      // Pie chart for users by university
      const universities = Object.entries(user.usersByUniversity);
      this.universityPieData = universities.map(([name, value], idx) => ({
        name,
        value,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }));
      this.averagePostPrice = post.averagePostPrice;
    });
  }
}
