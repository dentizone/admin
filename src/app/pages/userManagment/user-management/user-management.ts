import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from "../../../shared/components/toast-component/toast-component";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {

  viewToast = false;
  isToastSuccess = true;
  selectedStatus: string = '-1';
  statuses = [
    { name: 'PendingVerification', index: 0 },
    { name: 'EmailVerified', index: 1 },
    { name: 'Active', index: 2 },
    { name: 'Blacklisted', index: 3 }
  ];

  constructor(private userService: UserManagementService) { }

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

  users = [{
    id: "",
    fullName: "",
    universityName: "",
    status: "",
    email: ""
  }];
  filteredUsers = [...this.users];

  avatarImages: string[] = [
    '/assets/images/avatars/avatar1.png',
    '/assets/images/avatars/avatar2.png'
  ];
  userAvatars: Record<string, string> = {};

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
    this.userService.getUserStats().subscribe({
      next: data => {
        //this.totalUsers = data.totalUsers;
        this.blackListedUsers = data.usersPerStatus.Blacklisted;
        this.emailverifiedUsers = data.usersPerStatus.EmailVerified;
        this.kycVerifiedUsers = data.usersPerStatus.KycVerified;
        this.pendingVerificationUsers = data.usersPerStatus.PendingVerification;
      }
    });
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
    this.userService.getUsers(this.CurrentPage, keyword || '', status).subscribe({
      next: data => {
        this.users = data.items;
        this.totalUsers = data.totalCount;
        this.TotalPages = data.totalPages;
        this.assignUserAvatars(this.users);
        this.updateVisiblePages();
      },
      error: err => {
        console.error('Error loading users:', err);
      }
    });
  }

  changePage(page: number) {
    if (page < 1 || page > this.TotalPages) return;
    this.CurrentPage = page;
    this.loadUsers(+this.selectedStatus, this.searchKeyword);
  }

  filterUsers() {
    if (+this.selectedStatus != -1 || this.searchKeyword) {
      this.loadUsers(+this.selectedStatus, this.searchKeyword);
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  updateVisiblePages() {
    const maxVisible = 5;
    let start = Math.max(this.CurrentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > this.TotalPages) {
      end = this.TotalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    this.visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
      error: err => {
        console.error(err);
        this.toastMessage = 'Action Failed';
        this.isToastSuccess = false;
        this.showToast();
      }
    });
  }
}
