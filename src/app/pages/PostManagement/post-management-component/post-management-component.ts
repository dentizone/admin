import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post-service';
import { ToastComponent } from "../../../shared/components/toast-component/toast-component";
import { QuillModule } from 'ngx-quill';

interface Post{
  id:string;
  title:string;
  description:string;
  price:number;
  expireDate:string;
  condition:string;
  category:string;
  subCategory:string;
  status:string;
  seller: {
      id: string,
      username: string,
      academicYear: number,
      universityName: string
    },
    assets: [
      {
        id:string,
        url: string
      },
      {
        id: string,
        url: string
      }
    ],
    createdAt: string,
    updatedAt: string
}
@Component({
  selector: 'app-post-management-component',
  imports: [CommonModule, FormsModule, ToastComponent,QuillModule],
  templateUrl: './post-management-component.html',
  styleUrl: './post-management-component.css'
})
export class PostManagementComponent implements OnInit {

  posts:Post[]=[];
  visiblePages: number[] = [];
  selectedPost:Post={id:'string',
  title:'string',
  description:'string',
  price:0,
  expireDate:'string',
  condition:'string',
  category:'string',
  subCategory:'string',
  status:'string',
  seller: {
      id: 'string',
      username: 'string',
      academicYear: 0,
      universityName: 'string'
    },
    assets: [
      {
        id:'string',
        url: 'string'
      },
      {
        id: 'string',
        url: 'string'
      }
    ],
    createdAt: 'string',
    updatedAt: 'string'};
    currentPage=1;
  moreActionDropdown=false;
  selectedStatus=0;
  viewToast: boolean=false;
  toastMessage: string='';
  isToastSuccess: boolean=true;
  showPostDetails=false;
  TotalPages=0;
  totalProducts=0;
  keyword=''
  handleShowPostDetails(inputPost:Post){
    this.showPostDetails=!this.showPostDetails;
      this.selectedPost=inputPost;
  }
  closeShowPostDetails(){
    this.showPostDetails=false;
  }
 openedDropdownPostId: string | null = null;
activeTab=1;
handleModalTabs(active:number){
  this.activeTab=active;
}
searchUsingKeyword(){
  this.loadPosts();
}
handleMoreActionDropdown(event: MouseEvent, postId: string) {
  event.stopPropagation(); // prevent card click
  if (this.openedDropdownPostId === postId) {
    this.openedDropdownPostId = null; // toggle off
  } else {
    this.openedDropdownPostId = postId;
  }
}


  constructor(private readonly postService:PostService){}

  ngOnInit(): void {
    this.loadPosts()
  }
  loadPosts(){
    this.postService.getAllPosts(this.currentPage,this.keyword).subscribe({
      next:data=>{
        this.posts=data.items;
        if(this.totalProducts==0){
          this.TotalPages=data.totalPages;
        this.totalProducts=data.totalCount;
        }
        
        this.updateVisiblePages();
      },
      error:err=>{
        console.log(err)
      }
    })
  }
  showToast(){
this.viewToast=true;
setTimeout(() => {
    this.viewToast = false;
    this.toastMessage='';
    this.isToastSuccess=true;
  }, 2000);
}
   @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const clickedDropdown = target.closest('.dropdown-wrapper');
  if (!clickedDropdown) {
    this.openedDropdownPostId = null;
  }
}
changePage(page: number) {
    if (page < 1 || page > this.TotalPages) return;
    this.currentPage = page;
    this.loadPosts();
  }
  updateVisiblePages() {
    const maxVisible = 5;
    let start = Math.max(this.currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > this.TotalPages) {
      end = this.TotalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    this.visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
    changePostStatus(postID:string,status:number){
      this.postService.changePostStatus(postID,status).subscribe({
        next:data=>{
          this.toastMessage='The status change successfuly'
          this.showToast();
          this.loadPosts();
        },
        error:err=>{
          this.isToastSuccess=false;
          this.toastMessage='Failed to change Status';
          this.showToast();
        }
      })
    }
}
