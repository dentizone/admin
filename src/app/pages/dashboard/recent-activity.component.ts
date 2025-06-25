import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { Activity } from '../../core/models/activity.model';
import { DashboardDataService } from '../../core/services/dashboard-data.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html',
})
export class RecentActivityComponent implements OnInit {
  activities: Activity[] = [];
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly svc: DashboardDataService) {}

  ngOnInit() {
    this.svc.getRecentActivities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.activities = data);
  }


  formatTime(ts: Date): string {
    const diff = Date.now() - ts.getTime();
    const hrs = Math.floor(diff / 3600_000);
    return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  }
}
