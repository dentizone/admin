import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-tabs',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-tabs.component.html',
})
export class OrderTabsComponent {
  @Input() orders: any;
  @Input() selectedStatus = 'All';
  @Output() statusChange = new EventEmitter<string>();

  setStatus(status: string) {
    this.statusChange.emit(status);
  }
}