import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardDetails } from '../../../core/models/card.model';
import { Card } from '../../../shared/components/card/card';
import { PaginationComponent } from '../../../shared/components/Pagination/pagination-component/pagination-component';
import { ToastComponent } from '../../../shared/components/toast-component/toast-component';
import { UserManagementService } from '../user-management';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule,PaginationComponent, ToastComponent, Card],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  viewToast = false;
  isToastSuccess = true;
  selectedStatus: string = '-1';
  statuses = [
    { name: 'PendingVerification', index: 0 },
    { name: 'EmailVerified', index: 1 },
    { name: 'Active', index: 2 },
    { name: 'Blacklisted', index: 3 },
  ];

  actions = [
    { name: 'Active', index: 2 },
    { name: 'Blacklisted', index: 3 },
  ];

  constructor(private readonly userService: UserManagementService) {}

  onPageChanged(newPage: number) {
  this.CurrentPage = newPage;
  this.loadUsers(+this.selectedStatus, this.searchKeyword); 
}
  toastMessage = '';
  updateUserShow = false;

  totalUsers = 0;
  blackListedUsers = 0;
  emailverifiedUsers = 0;
  kycVerifiedUsers = 0;
  pendingVerificationUsers = 0;

  searchKeyword = '';
  selectedAction = '';

  TotalPages = 1;
  CurrentPage = 1;
  visiblePages: number[] = [];

  users = [
    {
      id: '',
      fullName: '',
      universityName: '',
      status: '',
      email: '',
    },
  ];
  filteredUsers = [...this.users];

  avatarImages: string[] = [
    '/assets/images/avatars/avatar1.png',
    '/assets/images/avatars/avatar2.png',
  ];
  userAvatars: Record<string, string> = {};

  statCards: CardDetails[] = [];

  showToast() {
    this.viewToast = true;
    setTimeout(() => {
      this.viewToast = false;
      this.toastMessage = '';
      this.isToastSuccess = true;
    }, 2000);
  }

  ngOnInit(): void {
    this.loadUsers();
    this.initializeDefaultStatCards();
    this.userService.getUserStats().subscribe({
      next: (data) => {
        this.blackListedUsers = data?.usersPerStatus?.Blacklisted ?? 0;
        this.emailverifiedUsers = data?.usersPerStatus?.EmailVerified ?? 0;
        this.kycVerifiedUsers = data?.usersPerStatus?.KycVerified ?? 0;
        this.pendingVerificationUsers = data?.usersPerStatus?.PendingVerification ?? 0;
        // Prepare stat cards after stats are loaded
        this.statCards = [
          {
            title: 'Total Users',
            value: data?.totalUsers ?? 0,
            icon: `<svg class='w-8 h-8 text-blue-900' fill='currentColor' viewBox='0 0 24 24'><path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C17 14.17 12.33 13 10 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z'/></svg>`,
          },
          {
            title: 'Pending Verification',
            value: data?.usersPerStatus?.PendingVerification ?? 0,
            icon: `<svg class='w-8 h-8 text-orange-500' fill='currentColor' viewBox='0 0 24 24'><path d='M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15.5-.85-4.75-2.8z'/></svg>`,
          },
          {
            title: 'Blacklisted Users',
            value: data?.usersPerStatus?.Blacklisted ?? 0,
            icon: `<svg class='w-8 h-8 text-red-600' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm6.32 13.9L8.1 5.68A8 8 0 0 1 18.32 15.9zM5.68 8.1 15.9 18.32A8 8 0 0 1 5.68 8.1z'/></svg>`,
          },
        ];
      },
      error: (err) => {
        console.error('Error loading user stats:', err);
        this.initializeDefaultStatCards();
      },
    });
  }

  initializeDefaultStatCards() {
    this.statCards = [
      {
        title: 'Total Users',
        value: 0,
        icon: `<svg class='w-8 h-8 text-blue-900' fill='currentColor' viewBox='0 0 24 24'><path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C17 14.17 12.33 13 10 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z'/></svg>`,
      },
      {
        title: 'Pending Verification',
        value: 0,
        icon: `<svg class='w-8 h-8 text-orange-500' fill='currentColor' viewBox='0 0 24 24'><path d='M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15.5-.85-4.75-2.8z'/></svg>`,
      },
      {
        title: 'Blacklisted Users',
        value: 0,
        icon: `<svg class='w-8 h-8 text-red-600' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm6.32 13.9L8.1 5.68A8 8 0 0 1 18.32 15.9zM5.68 8.1 15.9 18.32A8 8 0 0 1 5.68 8.1z'/></svg>`,
      },
    ];
  }

  getRandomAvatar(): string {
    const randomIndex = Math.floor(Math.random() * this.avatarImages.length);
    return this.avatarImages[randomIndex];
  }

  assignUserAvatars(users: any[]) {
    for (const user of users) {
      if (!this.userAvatars[user.id]) {
        this.userAvatars[user.id] = this.getRandomAvatar();
      }
    }
  }

  loadUsers(status?: number, keyword?: string) {
    this.userService
      .getUsers(this.CurrentPage, keyword || '', status)
      .subscribe({
        next: (data) => {
          this.users = data?.items ?? [];
          this.totalUsers = data?.totalCount ?? 0;
          this.TotalPages = data?.totalPages ?? 1;
          this.assignUserAvatars(this.users);
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.users = [];
          this.totalUsers = 0;
          this.TotalPages = 1;
        },
      });
  }
  filterUsers() {
    if (+this.selectedStatus != -1 || this.searchKeyword) {
      this.loadUsers(+this.selectedStatus, this.searchKeyword);
    } else {
      this.filteredUsers = [...this.users];
    }
  }
  showUpdateUser() {
    this.updateUserShow = !this.updateUserShow;
  }

  changeUserStatus(id: string) {
    this.userService.updateUserStatus(id, +this.selectedAction).subscribe({
      next: () => {
        this.toastMessage = 'Action Done Successfully';
        this.showToast();
        this.loadUsers(+this.selectedStatus, this.searchKeyword);
        this.selectedAction = '';
      },
      error: (err) => {
        console.error(err);
        this.toastMessage = 'Action Failed';
        this.isToastSuccess = false;
        this.showToast();
      },
    });
  }
}
