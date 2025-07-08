import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ReviewStats {
  Positive: number;
  Negative: number;
  Unknown: number;
  Neutral: number;
}

interface ReviewUser {
  id: string;
  username: string;
  academicYear: number;
  universityName: string | null;
}

interface ReviewItem {
  id: string;
  user: ReviewUser;
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

  constructor(private http: HttpClient) {}

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
          this.sentimentCounts = stats;
          this.loadingStats = false;
        },
        error: (err) => {
          this.errorStats = 'Failed to load stats.';
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

  onFilterChange() {
    this.page = 1;
    this.fetchReviews();
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.fetchReviews();
  }

  get filteredReviews() {
    // Filtering is now handled by the API, but keep this for template compatibility
    return this.reviews;
  }
}
