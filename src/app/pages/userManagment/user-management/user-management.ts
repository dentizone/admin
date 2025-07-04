import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management';
@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit{

  
  constructor(private userService:UserManagementService){}
  
  updateUserShow=false;
  totalUsers=0;
  TotalPages=1;
  CurrentPage=1;
  users=[{
    id: "",
    fullName: "",
    universityName: "",
    status: ""
  }]
  avatarImages: string[] = [
  '/assets/images/avatars/avatar1.png',
  '/assets/images/avatars/avatar2.png'
];

  getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * this.avatarImages.length);
  return this.avatarImages[randomIndex];
}

  showUpdateUser(){
    this.updateUserShow=!this.updateUserShow;
  }
  ngOnInit(): void {
    this.userService.getUsers(this.CurrentPage).subscribe({
      next:data=>{
        this.users=data.items;
        this.totalUsers=data.totalCount;
        this.TotalPages=data.totalPages;
      },
      error:err=>{
        console.log(err)
      }
    })
  }
}
