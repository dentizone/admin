
import { Component, OnInit } from '@angular/core';
import { Activity } from '../../core/models/activity.model';
import { DashboardDataService } from '../../core/services/dashboard-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity.component.html',
})
export class RecentActivityComponent implements OnInit {
  activities: Activity[] = [];

  constructor(private svc: DashboardDataService) {}

  ngOnInit() {
    this.svc.getRecentActivities().subscribe(data => this.activities = data);
  }


  formatTime(ts: Date): string {
    const diff = Date.now() - ts.getTime();
    const hrs = Math.floor(diff / 3600_000);
    return `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  }
}
