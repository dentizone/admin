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

  // Modal state
  showModal = false;
  modalAction: 'approve' | 'deny' | null = null;
  modalRequest: WithdrawalRequest | null = null;
  modalComment = '';
  modalLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchRequests();
  }

  showToast(message: string, isSuccess: boolean = true) {
    this.toastMessage = message;
    this.isToastSuccess = isSuccess;
    this.viewToast = true;
    setTimeout(() => {
      this.viewToast = false;
    }, 5000);
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
          this.showToast('Failed to load withdrawal stats.', false);
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

    // TODO: Replace with real token management
    const token = 'YOUR_SECRET_TOKEN';

    this.http
      .get<WithdrawalRequestResponse>(
        'https://apit.gitnasr.com/api/Wallet/all',
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
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
          this.showToast('Failed to load withdrawal requests.', false);
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

  openModal(action: 'approve' | 'deny', request: WithdrawalRequest) {
    this.showModal = true;
    this.modalAction = action;
    this.modalRequest = request;
    this.modalComment = '';
    this.modalLoading = false;
  }

  closeModal() {
    this.showModal = false;
    this.modalAction = null;
    this.modalRequest = null;
    this.modalComment = '';
    this.modalLoading = false;
  }

  submitModal() {
    if (!this.modalRequest || !this.modalAction) return;
    this.modalLoading = true;
    const id = this.modalRequest.id;
    const note = this.modalComment;
    const url =
      this.modalAction === 'approve'
        ? `https://apit.gitnasr.com/api/Wallet/withdrawal/${id}/approve`
        : `https://apit.gitnasr.com/api/Wallet/withdrawal/${id}/reject`;
    // TODO: Replace with real token management
    const token = 'YOUR_SECRET_TOKEN';
    this.http
      .post(url, note ? { note } : {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe({
        next: () => {
          this.showToast(
            this.modalAction === 'approve'
              ? 'Withdrawal approved!'
              : 'Withdrawal denied!',
            true
          );
          this.closeModal();
          this.fetchRequests();
          this.fetchStats();
        },
        error: () => {
          this.showToast('Action failed. Please try again.', false);
          this.modalLoading = false;
        },
      });
  }
}
