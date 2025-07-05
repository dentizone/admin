import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from "../../../shared/components/toast-component/toast-component";
@Component({
  selector: 'app-user-management',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit{

  viewToast=false;
  isToastSuccess=true;
  selectedStatus: string = '';
  statuses: string[] = ['PendingVerification', 'EmailVerified', 'KycVerified','Blacklisted'];
  constructor(private userService:UserManagementService){}
  toastMessage='';
  updateUserShow=false;
  totalUsers=0;
  blackListedUsers=0;
  emailverifiedUsers=0;
  kycVerifiedUsers=0;
  pendingVerificationUsers=0;

  selectedAction='';
  TotalPages=1;
  CurrentPage=1;
  visiblePages: number[] = [];
  users=[{
    id: "",
    fullName: "",
    universityName: "",
    status: "",
    email:""
  }]
  filteredUsers = [
    {
    id: "",
    fullName: "",
    universityName: "",
    status: "",
    email:""
  }
  ];
  avatarImages: string[] = [
  '/assets/images/avatars/avatar1.png',
  '/assets/images/avatars/avatar2.png'
];
showToast(){
this.viewToast=true;
setTimeout(() => {
    this.viewToast = false;
    this.toastMessage='';
    this.isToastSuccess=true;
  }, 2000);
}
loadUsers() {
  this.userService.getUsers(this.CurrentPage).subscribe({
    next: data => {
      this.users = data.items;
      this.totalUsers = data.totalCount;
      this.TotalPages = data.totalPages;
      this.updateVisiblePages();
      this.filterUsers();
    },
    error: err => {
      console.error('Error loading users:', err);
    }
  });
}

changePage(page: number) {
  if (page < 1 || page > this.TotalPages) return;
  this.CurrentPage = page;
   this.userService.getUsers(this.CurrentPage).subscribe({
      next:data=>{
        this.users=data.items;
        this.updateVisiblePages();
        this.filterUsers();
        },
      error:err=>{
        console.log(err)
      }
    })
}
filterUsers() {
  if (this.selectedStatus) {
    this.filteredUsers = this.users.filter(
      user => user.status === this.selectedStatus
    );
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
  getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * this.avatarImages.length);
  return this.avatarImages[randomIndex];
}

  showUpdateUser(){
    this.updateUserShow=!this.updateUserShow;
  }
  ngOnInit(): void {
    this.loadUsers();
    this.userService.getUserStats().subscribe({
      next:data=>{
        this.totalUsers=data.totalUsers;
        this.blackListedUsers=data.usersPerStatus.Blacklisted;
        this.emailverifiedUsers=data.usersPerStatus.EmailVerified;
        this.kycVerifiedUsers=data.usersPerStatus.KycVerified;
        this.pendingVerificationUsers=data.usersPerStatus.PendingVerification;
      }
    })
  }
  changeUserStatus(id:string){
    this.userService.updateUserStatus(id,+this.selectedAction).subscribe({
      next:data=>{console.log("success")
        this.toastMessage='Action Done Successfuly';
        this.showToast();
        this.loadUsers();
        this.selectedAction=''
      },
      error:err=>{
        console.error(err);
        this.toastMessage='Action Failed';
        this.isToastSuccess=false;
        this.showToast();
      }
    })
    
  }
}
