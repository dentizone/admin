import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from "../../shared/components/card/card";
import { CardDetails } from '../../core/models/card.model';
import { RecentActivityComponent } from './recent-activity.component';
import { ChartComponent } from './chart.component';
import { PostCategory } from '../../core/models/post-category.model';
import { DASHBOARD_ICONS } from '../../core/constants/dashboard-icons';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Card, ChartComponent, RecentActivityComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
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
      value: 900,
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
  ]

    postCategories: PostCategory[] = [
    { name: 'Equipment',    value: 45, color: '#3B82F6' },
    { name: 'Books',        value: 25, color: '#A78BFA' },
    { name: 'Instruments',  value: 15, color: '#EC4899' },
    { name: 'Supplies',     value: 10, color: '#F59E0B' },
    { name: 'Other',        value: 5,  color: '#10B981' },
  ];
}
