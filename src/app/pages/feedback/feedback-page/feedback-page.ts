import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ReviewStats {
  Positive?: number;
  Negative?: number;
  Unknown?: number;
  Neutral?: number;
  positive?: number;
  negative?: number;
  unknown?: number;
  neutral?: number;
}

interface ReviewUser {
  id: string;
  username?: string;
  academicYear: number;
  universityName: string | null;
}

interface OrderViewDto {
  id: string;
  buyerName: string;
  totalAmount: number;
  orderShipmentAddress: string | null;
  createdAt: string;
  statusTimeline: any[];
  orderItems: any[];
  isReviewed: boolean;
}

interface ReviewItem {
  id: string;
  user?: ReviewUser;
  orderViewDto?: OrderViewDto;
  comment: string;
  stars: number;
  createdAt: string;
  sentiment?: string;
}

interface ReviewResponse {
  items: ReviewItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './feedback-page.html',
  styleUrls: ['./feedback-page.css'],
})
export class FeedbackPageComponent implements OnInit {
  sentimentCounts: ReviewStats = {
    Positive: 0,
    Negative: 0,
    Unknown: 0,
    Neutral: 0,
  };
  filter = '';
  reviews: ReviewItem[] = [];
  loadingStats = false;
  loadingReviews = false;
  errorStats = '';
  errorReviews = '';

  // Filters
  stars: number | null = null;
  sentiment: string | null = null;
  createdAfter: string | null = null;
  createdBefore: string | null = null;
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 1;

  constructor(private readonly http: HttpClient) {}

  onPageChanged(newPage: number) {
    this.page = newPage;
    this.fetchReviews();
  }

  ngOnInit() {
    this.fetchStats();
    this.fetchReviews();
  }

  fetchStats() {
    this.loadingStats = true;
    this.errorStats = '';
    this.http
      .get<ReviewStats>('https://apit.gitnasr.com/api/Review/stats')
      .subscribe({
        next: (stats) => {
          // Handle both lowercase and uppercase sentiment keys from API
          this.sentimentCounts = {
            Positive: stats?.Positive ?? stats?.positive ?? 0,
            Negative: stats?.Negative ?? stats?.negative ?? 0,
            Unknown: stats?.Unknown ?? stats?.unknown ?? 0,
            Neutral: stats?.Neutral ?? stats?.neutral ?? 0,
          };
          this.loadingStats = false;
        },
        error: (err) => {
          this.errorStats = 'Failed to load stats.';
          this.sentimentCounts = {
            Positive: 0,
            Negative: 0,
            Unknown: 0,
            Neutral: 0,
          };
          this.loadingStats = false;
        },
      });
  }

  fetchReviews() {
    this.loadingReviews = true;
    this.errorReviews = '';
    let params = new HttpParams()
      .set('Page', this.page)
      .set('PageSize', this.pageSize);
    if (this.stars) params = params.set('Stars', this.stars);
    if (this.sentiment) params = params.set('Sentiment', this.sentiment);
    if (this.createdAfter)
      params = params.set('CreatedAfter', this.createdAfter);
    if (this.createdBefore)
      params = params.set('CreatedBefore', this.createdBefore);
    if (this.filter) params = params.set('SearchText', this.filter);

    this.http
      .get<ReviewResponse>('https://apit.gitnasr.com/api/Review/all', {
        params,
      })
      .subscribe({
        next: (res) => {
          this.reviews = res.items;
          this.totalCount = res.totalCount;
          this.totalPages = res.totalPages;
          this.loadingReviews = false;
        },
        error: (err) => {
          this.errorReviews = 'Failed to load reviews.';
          this.loadingReviews = false;
        },
      });
  }

  clearFilters() {
    this.filter = '';
    this.stars = null;
    this.sentiment = null;
    this.createdAfter = null;
    this.createdBefore = null;
    this.page = 1;
    this.fetchReviews();
  }

  getStartResult(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  getMaxResults(): number {
    return Math.min(this.page * this.pageSize, this.totalCount);
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  onFilterChange() {
    this.page = 1;
    this.fetchReviews();
  }

  get filteredReviews() {
    // Filtering is now handled by the API, but keep this for template compatibility
    return this.reviews;
  }

  // Helper method to capitalize sentiment for display
  capitalizeSentiment(sentiment: string | undefined): string {
    if (!sentiment) return 'Unknown';
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
  }
}
