import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService } from '../post-service';

@Component({
  selector: 'app-post-filters',
  templateUrl: './filter-component.html',
  imports:[CommonModule,FormsModule]
})
export class FiltersComponent {
  @Input() cities: string[] = [];
  @Input() categories: any[] = [];
  subcategories= [{
    name: '',
    id: '',
    category: {
      id: '',
      name: ''
    }},
  ];

  @Input() filters: any = {};
  @Output() filtersChange = new EventEmitter<any>();

  @Output() filter = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  constructor(private readonly postService:PostService){}
  // Optional: Emit changes immediately on value change
  onFilter() {
    this.filtersChange.emit(this.filters);
    this.filter.emit();
  }

  onReset() {
    this.filters = {
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
  this.filtersChange.emit(this.filters);
  this.reset.emit();
  }

  // Dropdown state (for custom dropdowns like city, category, etc.)
  cityDropdownOpen = false;
  categoryDropdownOpen = false;
  subcategoryDropdownOpen = false;

  selectCity(city: string) {
    this.filters.city = city;
    this.cityDropdownOpen = false;
  }

  selectCategory(category: string,id:string) {
    this.filters.category = category;
    this.categoryDropdownOpen = false;
    this.getSubcategories(id);
  }

  getSubcategories(id:string){
    this.postService.getSubcategories(id).subscribe({
      next:data=>{
        this.subcategories=data
      }
    })
    
  }

  selectSubcategory(sub: string) {
    this.filters.subCategory = sub;
    this.subcategoryDropdownOpen = false;
  }
}
