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
    const diff = Date.now() - date.getTime();
    const hrs = Math.floor(diff / 3600_000);
    if (hrs < 1) {
      const mins = Math.floor(diff / 60000);
      return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    }
    return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  }
}
