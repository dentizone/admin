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
  @Output() statusChange = new EventEmitter<string>();
  @Output() sellerNameChange = new EventEmitter<string>();
  @Output() buyerNameChange = new EventEmitter<string>();
  @Output() orderDateChange = new EventEmitter<string>();

  showActions = false;

  private sellerNameDebounce: any;
  private buyerNameDebounce: any;
  private sellerNameValue = '';
  private buyerNameValue = '';

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

  onStatusChange(status: string) {
    this.statusChange.emit(status);
  }

  onSellerNameInput(value: string) {
    this.sellerNameValue = value;
    if (this.sellerNameDebounce) clearTimeout(this.sellerNameDebounce);
    this.sellerNameDebounce = setTimeout(() => {
      this.sellerNameChange.emit(this.sellerNameValue);
    }, 500);
  }

  onSellerNameBlur() {
    this.sellerNameChange.emit(this.sellerNameValue);
  }

  onBuyerNameInput(value: string) {
    this.buyerNameValue = value;
    if (this.buyerNameDebounce) clearTimeout(this.buyerNameDebounce);
    this.buyerNameDebounce = setTimeout(() => {
      this.buyerNameChange.emit(this.buyerNameValue);
    }, 500);
  }

  onBuyerNameBlur() {
    this.buyerNameChange.emit(this.buyerNameValue);
  }

  onOrderDateChange(date: string) {
    this.orderDateChange.emit(date);
  }
}
