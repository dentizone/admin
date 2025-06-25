import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UniversityService } from '../../core/services/university.service';
import { University, CreateUniversityDto, UpdateUniversityDto, PagedResultDto } from '../../core/models/university.model';

@Component({
  selector: 'app-university',
  standalone: true,
  imports: [FormsModule, NgClass],
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

  constructor(private readonly universityService: UniversityService) {
    this.loadUniversities();
  }

  loadUniversities() {
    this.universityService.getAll(this.page, this.pageSize).subscribe((result: PagedResultDto<University>) => {
      this.universities = result.items;
      this.page = result.page;
      this.pageSize = result.pageSize;
      this.totalCount = result.totalCount;
      this.totalPages = result.totalPages;
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

  save() {
    if (this.isEdit && this.selectedUniversity) {
      this.universityService.update(this.selectedUniversity.id!, this.form as UpdateUniversityDto).subscribe(() => {
        this.loadUniversities();
        this.clearForm();
      });
    } else {
      this.universityService.create(this.form as CreateUniversityDto).subscribe(() => {
        this.loadUniversities();
        this.clearForm();
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