import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CardDetails } from '../../../core/models/card.model';
import { PaginationComponent } from '../../../shared/components/Pagination/pagination-component/pagination-component';
import { ToastComponent } from '../../../shared/components/toast-component/toast-component';
import { FiltersComponent } from "../filter-component/filter-component";
import { PostService } from '../post-service';

interface Post {
  id: string;
  title: string;
  description: string;
  price: number;
  expireDate: string;
  condition: string;
  category: string;
  subCategory: string;
  status: string;
  seller: {
    id: string;
    username: string;
    academicYear: number;
    universityName: string;
  };
  assets: [
    {
      id: string;
      url: string;
    },
    {
      id: string;
      url: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}
@Component({
  selector: 'app-post-management-component',
  imports: [CommonModule, FormsModule, ToastComponent, QuillModule, PaginationComponent, FiltersComponent],
  templateUrl: './post-management-component.html',
})
export class PostManagementComponent implements OnInit {
  selectCity(c:string) {
    this.filters.city=c;
  }
  dropDown=false;
  handleDropdown(){
    this.dropDown=!this.dropDown;
  }
  //Categories section for filter
  categories=[
    {
      id: '',
      categoryName: '',
      subcategories: ['']
    }];
  categoryDropdownOpen=false;
   selectCategory(categoryName: string) {
    this.filters.category = categoryName;
    this.categoryDropdownOpen = false;
  }
filters = {
    city: '',
    category: '',
    subCategory: '',
    condition: '',
    minPrice: null,
    maxPrice: null,
    sortBy: '',
    sortDirection: true,
    postStatus: 1
};

  //subcategories section for filter
  subcategories: string[] = ['AI', 'Web Development', 'Mobile Apps', 'UI/UX'];
  subcategoryDropdownOpen = false;
  selectSubcategory(subcategoryName: string) {
    this.filters.subCategory = subcategoryName;
    this.subcategoryDropdownOpen = false;
  }
  posts: Post[] = [];
  selectedPost: Post = {
    id: 'string',
    title: 'string',
    description: 'string',
    price: 0,
    expireDate: 'string',
    condition: 'string',
    category: 'string',
    subCategory: 'string',
    status: 'string',
    seller: {
      id: 'string',
      username: 'string',
      academicYear: 0,
      universityName: 'string',
    },
    assets: [
      {
        id: 'string',
        url: 'string',
      },
      {
        id: 'string',
        url: 'string',
      },
    ],
    createdAt: 'string',
    updatedAt: 'string',
  };
  currentPage = 1;
  moreActionDropdown = false;
  selectedStatus = 0;
  viewToast: boolean = false;
  toastMessage: string = '';
  isToastSuccess: boolean = true;
  showPostDetails = false;
  TotalPages = 0;
  totalProducts = 0;
  keyword = '';
  postStats: any = null;
  statCards: (CardDetails & { color: string })[] = [];
  cityDropdownOpen: boolean=false;
  cities: string[]=['Alex','aswan','cairo'];
  handleShowPostDetails(inputPost: Post) {
    this.showPostDetails = !this.showPostDetails;
    this.selectedPost = inputPost;
  }
  closeShowPostDetails() {
    this.showPostDetails = false;
  }
  openedDropdownPostId: string | null = null;
  activeTab = 1;
  handleModalTabs(active: number) {
    this.activeTab = active;
  }
  searchUsingKeyword() {
    this.currentPage = 1;
    this.loadPosts();
  }

  resetFilters() {
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

  constructor(private readonly postService: PostService) {}

  ngOnInit(): void {
    // Initialize cards with zero values immediately
    this.initializeEmptyStatCards();
    
    this.loadPosts();
    this.loadPostStats();
    this.loadFilters();
  }
  loadFilters(){
    this.postService.getFilters().subscribe({
      next:data=>{
        this.cities=data.cities;
        this.categories=data.categories},
        error:err=>{
          console.log(err);
        }
    })
  }
  loadPosts() {
    this.postService
      .getAllPosts({
        pageNumber: this.currentPage,
        keyword: this.keyword,
        city: this.filters.city,
        category: this.filters.category,
        subCategory: this.filters.subCategory,
        condition: this.filters.condition ?? undefined,
        minPrice: this.filters.minPrice ?? undefined,
        maxPrice: this.filters.maxPrice ?? undefined,
        sortBy: this.filters.sortBy ?? undefined,
        sortDirection: this.filters.sortDirection,
        postStatus: this.filters.postStatus,
      })
      .subscribe({
        next: (data) => {
          this.posts = data.items;
          if (this.totalProducts == 0) {
            this.TotalPages = data.totalPages;
            this.totalProducts = data.totalCount;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  loadPostStats() {
    this.postService.getPostStats().subscribe({
      next: (stats) => {
        this.postStats = stats;
        this.updateStatCards(stats);
      },
      error: (err) => {
        console.error('Failed to load post stats', err);
        // Initialize cards with zero values on error
        this.initializeEmptyStatCards();
      },
    });
  }

  private updateStatCards(stats: any) {
    this.statCards = [
      {
        title: 'Active',
        value: this.getSafeStatValue(stats?.Active),
        color: '#22c55e', // green-500
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#22c55e" stroke-width="2" fill="#bbf7d0"/>
          <path d="M9 12l2 2 4-4" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      },
      {
        title: 'Expired',
        value: this.getSafeStatValue(stats?.Expired),
        color: '#f59e42', // orange-400
        icon: `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2' width='32' height='32'>
          <circle cx='12' cy='12' r='10' stroke='#f59e42' stroke-width='2' fill='#fef3c7'/>
          <path stroke='#f59e42' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l2 2'/>
        </svg>`
      },
      {
        title: 'Pending',
        value: this.getSafeStatValue(stats?.Pending),
        color: '#fbbf24', // yellow-400
        icon: `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2' width='32' height='32'>
          <circle cx='12' cy='12' r='10' stroke='#fbbf24' stroke-width='2' fill='#fef9c3'/>
          <path stroke='#fbbf24' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M12 8v4h4'/>
        </svg>`
      },
      {
        title: 'Rejected',
        value: this.getSafeStatValue(stats?.Rejected),
        color: '#ef4444', // red-500
        icon: `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2' width='32' height='32'>
          <circle cx='12' cy='12' r='10' stroke='#ef4444' stroke-width='2' fill='#fee2e2'/>
          <path stroke='#ef4444' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M15 9l-6 6m0-6l6 6'/>
        </svg>`
      },
      {
        title: 'Removed',
        value: this.getSafeStatValue(stats?.Removed),
        color: '#a3a3a3', // neutral-400
        icon: `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2' width='32' height='32'>
          <circle cx='12' cy='12' r='10' stroke='#a3a3a3' stroke-width='2' fill='#f3f4f6'/>
          <path stroke='#a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M9 9l6 6m0-6l-6 6'/>
        </svg>`
      },
      {
        title: 'Sold',
        value: this.getSafeStatValue(stats?.Sold),
        color: '#3b82f6', // blue-500
        icon: `<svg fill='none' viewBox='0 0 24 24' stroke='currentColor' stroke-width='2' width='32' height='32'>
          <circle cx='12' cy='12' r='10' stroke='#3b82f6' stroke-width='2' fill='#dbeafe'/>
          <path stroke='#3b82f6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M9 12l2 2 4-4'/>
        </svg>`
      },
    ];
  }

  private getSafeStatValue(value: any): number {
    // Ensure we always return a number, defaulting to 0 if value is null, undefined, or NaN
    const numValue = Number(value);
    return isNaN(numValue) ? 0 : numValue;
  }

  private initializeEmptyStatCards() {
    this.updateStatCards({
      Active: 0,
      Expired: 0,
      Pending: 0,
      Rejected: 0,
      Removed: 0,
      Sold: 0
    });
  }
  showToast() {
    this.viewToast = true;
    setTimeout(() => {
      this.viewToast = false;
      this.toastMessage = '';
      this.isToastSuccess = true;
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
  onPageChanged(newPage: number) {
  this.currentPage = newPage;
  this.loadPosts(); 
}
  changePostStatus(postID: string, status: number) {
    this.postService.changePostStatus(postID, status).subscribe({
      next: (data) => {
        this.toastMessage = 'The status change successfuly';
        this.showToast();
        this.loadPosts();
        this.showPostDetails = false;
      },
      error: (err) => {
        this.isToastSuccess = false;
        this.toastMessage = 'Failed to change Status';
        this.showToast();
      },
    });
  }
}
