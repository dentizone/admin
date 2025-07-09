import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-filters',
  templateUrl: './filter-component.html',
  imports:[CommonModule,FormsModule]
})
export class FiltersComponent {
  @Input() cities: string[] = [];
  @Input() categories: string[] = [];
  @Input() subcategories: string[] = [];

  @Input() filters: any = {};
  @Output() filtersChange = new EventEmitter<any>();

  @Output() filter = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

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

  selectCategory(category: string) {
    this.filters.category = category;
    this.categoryDropdownOpen = false;
  }

  selectSubcategory(sub: string) {
    this.filters.subCategory = sub;
    this.subcategoryDropdownOpen = false;
  }
}
