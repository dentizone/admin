import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent {
  @Input() orders: any[] = [];
  @Output() orderClick = new EventEmitter<any>();

  onClick(order: any) {
    this.orderClick.emit(order);
  }

  getSellerInitials(sellerName: string): string {
    if (!sellerName) return '?';
    return sellerName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}
