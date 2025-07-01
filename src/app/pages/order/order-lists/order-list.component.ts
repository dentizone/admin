import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent {
  @Input() orders: any[] = [];
  @Output() orderClick = new EventEmitter<any>();

  onClick(order: any) {
    this.orderClick.emit(order);
  }
}
