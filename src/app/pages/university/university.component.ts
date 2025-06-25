import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UniversityService } from '../../core/services/university.service';
import { University, CreateUniversityDto, UpdateUniversityDto, PagedResultDto } from '../../core/models/university.model';

@Component({
  selector: 'app-university',
  standalone: true,
  imports: [FormsModule, NgClass],
  providers: [],
  templateUrl: './university.component.html',
})
export class UniversityComponent {
  universities: University[] = [];
  selectedUniversity: University | null = null;
  form: Partial<CreateUniversityDto & UpdateUniversityDto> = {};
  isEdit = false;

  // Pagination state
  page = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  public Math = Math;
  public confirm = confirm;

  loading = false;
  submitted = false;

  // Custom toast state
  toastMessage: string | null = null;
  toastType: 'error' | 'success' | null = null;

  constructor(
    private readonly universityService: UniversityService,
  ) {
    this.loadUniversities();
  }

  showToast(message: string, type: 'error' | 'success' = 'error') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
    }, 3500);
  }

  loadUniversities() {
    this.universityService.getAll(this.page, this.pageSize).subscribe({
      next: (result: PagedResultDto<University>) => {
        this.universities = result.items;
        this.page = result.page;
        this.pageSize = result.pageSize;
        this.totalCount = result.totalCount;
        this.totalPages = result.totalPages;
      },
      error: (err) => {
        this.showToast('Failed to load universities. Please try again.', 'error');
      }
    });
  }

  selectUniversity(university: University) {
    this.selectedUniversity = university;
    this.form = { ...university };
    this.isEdit = true;
  }

  clearForm() {
    this.selectedUniversity = null;
    this.form = {};
    this.isEdit = false;
  }

  isDomainValid(domain: string | undefined): boolean {
    if (!domain) return false;
    // Simple domain regex: must have at least one dot and valid chars
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain.trim());
  }

  save() {
    this.submitted = true;
    if (!this.form.name || !this.form.name.trim() || !this.isDomainValid(this.form.domain)) {
      return;
    }
    this.loading = true;
    const finalize = () => {
      this.loading = false;
      this.submitted = false;
    };
    if (this.isEdit && this.selectedUniversity) {
      this.universityService.update(this.selectedUniversity.id!, this.form as UpdateUniversityDto).subscribe({
        next: () => {
          this.loadUniversities();
          this.clearForm();
        },
        complete: finalize,
        error: finalize
      });
    } else {
      this.universityService.create(this.form as CreateUniversityDto).subscribe({
        next: () => {
          this.loadUniversities();
          this.clearForm();
        },
        complete: finalize,
        error: finalize
      });
    }
  }

  delete(university: University) {
    if (university.id) {
      this.universityService.delete(university.id).subscribe(() => this.loadUniversities());
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
      this.loadUniversities();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUniversities();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadUniversities();
    }
  }
} 