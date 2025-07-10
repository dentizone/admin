import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    Activity,
    ActivityApiResponse,
    UserActivities,
} from '../../core/models/activity.model';
import { ActivityFilter, ActivityService } from './activity.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  activities: Activity[] = [];
  loading = false;
  filter: ActivityFilter = { pageNumber: 1 };
  totalCount = 0;
  pageSize = 10;
  totalPages = 1;
  userActivities = Object.values(UserActivities);
  Math = Math; // Add Math property

  constructor(private readonly activityService: ActivityService) {}

  ngOnInit() {
    this.fetchActivities();
  }

  fetchActivities() {
    this.loading = true;
    this.activityService.getActivities(this.filter).subscribe({
      next: (res: ActivityApiResponse) => {
        this.activities = res.items;
        this.totalCount = res.totalCount;
        this.pageSize = res.pageSize;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.activities = [];
        this.loading = false;
      },
    });
  }

  onPageChange(page: number) {
    this.filter.pageNumber = page;
    this.fetchActivities();
  }

  onFilterChange() {
    this.filter.pageNumber = 1;
    this.fetchActivities();
  }

  getMaxResults(): number {
    return Math.min(
      (this.filter.pageNumber ?? 1) * (this.pageSize ?? 10),
      this.totalCount
    );
  }

  getPaginationRange(): number[] {
    const range = [];
    const start = Math.max(1, (this.filter.pageNumber ?? 1) - 2);
    const end = Math.min(this.totalPages, start + 4);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  getRowNumber(index: number): number {
    return ((this.filter.pageNumber ?? 1) - 1) * (this.pageSize ?? 10) + index + 1;
  }

  getStartResult(): number {
    return ((this.filter.pageNumber ?? 1) - 1) * (this.pageSize ?? 10) + 1;
  }
}
