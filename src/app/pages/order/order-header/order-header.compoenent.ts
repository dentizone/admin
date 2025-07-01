import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-order-header',
  imports: [CommonModule],
  templateUrl: './order-header.component.html',
})
export class OrderHeaderComponent {
  @Output() completeOrders = new EventEmitter<void>();
  @Output() deleteOrders = new EventEmitter<void>();
  @Output() markPending = new EventEmitter<void>();
  @Output() markProcessing = new EventEmitter<void>();

  showActions = false;

  onCompleteClick() {
    this.completeOrders.emit();
  }

  toggleActions() {
    this.showActions = !this.showActions;
  }

  onDeleteClick() {
    this.deleteOrders.emit();
    this.showActions = false;
  }

  onMarkPendingClick() {
    this.markPending.emit();
    this.showActions = false;
  }

  onMarkProcessingClick() {
    this.markProcessing.emit();
    this.showActions = false;
  }

}