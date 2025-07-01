import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-list.component.html',
})
export class OrderListComponent {
  @Input() orders: any[] = [];
}