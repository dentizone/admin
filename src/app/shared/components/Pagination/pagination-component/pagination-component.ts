import { CommonModule } from '@angular/common';
import { Component, Input,Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination-component',
  imports: [CommonModule],
  templateUrl: './pagination-component.html',
})
export class PaginationComponent implements OnInit{
  ngOnInit(): void {
    setTimeout(()=>{this.updateVisiblePages();},2000)
  }
  @Output() pageChanged = new EventEmitter<number>();

  @Input() currentPage=0;
  @Input() TotalPages=0;
  visiblePages: number[] = [];
  changePage(page: number) {
    if (page < 1 || page > this.TotalPages) return;
    this.currentPage = page;
    //this.loadPosts();
    this.pageChanged.emit(this.currentPage);
  }
  updateVisiblePages() {
    const maxVisible = 5;
    let start = Math.max(this.currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > this.TotalPages) {
      end = this.TotalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    this.visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }
}
