import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { Activity } from '../../core/models/activity.model';
import { DashboardDataService } from '../../core/services/dashboard-data.service';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recent-activity.component.html',
})
export class RecentActivityComponent implements OnInit {
  activities: Activity[] = [];
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly svc: DashboardDataService) {}

  ngOnInit() {
    this.svc
      .getRecentActivities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => (this.activities = data));
  }

  formatTime(detectedAt: string): string {
    const date = new Date(detectedAt);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hrs = Math.floor(diff / 3600000);
      return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // More than 7 days - show actual date
    const isCurrentYear = date.getFullYear() === now.getFullYear();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      ...(isCurrentYear ? {} : { year: 'numeric' }),
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
  }
}
