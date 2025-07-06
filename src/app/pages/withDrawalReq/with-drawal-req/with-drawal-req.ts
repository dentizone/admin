import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../shared/components/toast-component/toast-component';

interface WithdrawalRequest {
  id: string;
  fullName: string;
  userEmail: string;
  createdAt: string;
  amount: number;
  status: string;
}

interface WithdrawalRequestResponse {
  items: WithdrawalRequest[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

@Component({
  selector: 'app-with-drawal-req',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './with-drawal-req.html',
  styleUrl: './with-drawal-req.css',
  standalone: true,
})
export class WithDrawalReq implements OnInit {
  viewToast = false;
  isToastSuccess = true;
  toastMessage = '';

  // Data
  requests: WithdrawalRequest[] = [];
  totalRequests = 0;
  loading = false;

  // Stats
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
  };

  // Filters
  filter = {
    status: '',
    searchTerm: '',
    date: '',
    page: 1,
  };
  pageSize = 10;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchRequests();
  }

  fetchStats() {
    // TODO: Replace with real token management
    const token = 'YOUR_SECRET_TOKEN';
    this.http
      .get<any>('https://apit.gitnasr.com/api/Wallet/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: (res) => {
          this.stats = {
            total:
              (res.Approved || 0) +
              (res.Completed || 0) +
              (res.Failed || 0) +
              (res.Pending || 0) +
              (res.Rejected || 0),
            approved: res.Approved || 0,
            completed: res.Completed || 0,
            pending: res.Pending || 0,
            rejected: res.Rejected || 0,
          };
        },
        error: (err) => {
          this.toastMessage = 'Failed to load withdrawal stats.';
          this.isToastSuccess = false;
          this.viewToast = true;
        },
      });
  }

  fetchRequests() {
    this.loading = true;
    let params = new HttpParams()
      .set('Page', this.filter.page)
      .set('PageSize', this.pageSize);
    if (this.filter.status)
      params = params.set('RequestStatus', this.filter.status);
    if (this.filter.searchTerm)
      params = params.set('SearchTerm', this.filter.searchTerm);
    if (this.filter.date)
      params = params.set('RequestDateTime', this.filter.date);

    this.http
      .get<WithdrawalRequestResponse>(
        'https://apit.gitnasr.com/api/Wallet/all',
        {
          params,
        }
      )
      .subscribe({
        next: (res) => {
          this.requests = res.items;
          this.totalRequests = res.totalCount;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.toastMessage = 'Failed to load withdrawal requests.';
          this.isToastSuccess = false;
          this.viewToast = true;
          this.loading = false;
        },
      });
  }

  onFilterChange() {
    this.filter.page = 1;
    this.fetchRequests();
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.filter.page = page;
    this.fetchRequests();
  }
}
