import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { OrderHeaderComponent } from "./order-header/order-header.compoenent";
import { OrderTabsComponent } from "./order-tabs/order-tabs.component";
import { OrderListComponent } from "./order-lists/order-list.component";
interface Order {
  id: string;
  date: string;
  product: string;
  quantity: number;
  icon: string;
  selected: boolean;
  statusColor: string;
  status: string;
}
@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule,OrderHeaderComponent,OrderTabsComponent,OrderListComponent],
  templateUrl: './order-management.component.html',
})
export class OrderManagementComponent {
  selectedStatus = 'All';
  allOrders: Order[] = [
    {
      id: '#ORD-2024-001',
      date: 'June 24, 2024',
      product: 'Wireless Headphones',
      quantity: 1,
      icon: 'bg-purple-200',
      selected: true,
      statusColor: 'bg-blue-900',
      status: 'Completed'
    },
    {
      id: '#ORD-2024-002',
      date: 'June 23, 2024',
      product: 'Smartphone Case',
      quantity: 2,
      icon: 'bg-yellow-300',
      selected: false,
      statusColor: 'bg-yellow-600',
      status: 'Pending'
    },
    {
      id: '#ORD-2024-003',
      date: 'June 22, 2024',
      product: 'Smart Watch',
      quantity: 1,
      icon: 'bg-purple-200',
      selected: false,
      statusColor: 'bg-blue-500',
      status: 'Processing'
    }
  ];

  showModal = false;
  modalAction: 'delete' | 'pending' | 'processing' = 'delete';
  get orders() {
    return {
      all: this.allOrders.length,
      pending: this.allOrders.filter(o => o.status === 'Pending').length,
      processing: this.allOrders.filter(o => o.status === 'Processing').length,
      completed: this.allOrders.filter(o => o.status === 'Completed').length,
      cancelled: this.allOrders.filter(o => o.status === 'Cancelled').length,
    };
  }

  get filteredOrders() {
    return this.selectedStatus === 'All'
      ? this.allOrders
      : this.allOrders.filter(order => order.status === this.selectedStatus);
  }

  onFilterChange(status: string) {
    this.selectedStatus = status;
  }

  completeSelectedOrders() {
    this.allOrders.forEach(order => {
      if (order.selected && (order.status === 'Pending' || order.status === 'Processing')) {
        order.status = 'Completed';
        order.statusColor = 'bg-blue-900';
      }
    });
  }
     confirmAction(action: 'delete' | 'pending' | 'processing') {
    this.modalAction = action;
    this.showModal = true;
  }

  performConfirmedAction() {
    switch (this.modalAction) {
      case 'delete':
        this.deleteSelectedOrders();
        break;
      case 'pending':
        this.markSelectedAsPending();
        break;
      case 'processing':
        this.markSelectedAsProcessing();
        break;
    }
    this.showModal = false;
  }

  deleteSelectedOrders() {
    this.allOrders = this.allOrders.filter(order => !order.selected);
  }

  markSelectedAsPending() {
    this.allOrders.forEach(order => {
      if (order.selected) {
        order.status = 'Pending';
        order.statusColor = 'bg-yellow-600';
      }
    });
  }

  markSelectedAsProcessing() {
    this.allOrders.forEach(order => {
      if (order.selected) {
        order.status = 'Processing';
        order.statusColor = 'bg-blue-500';
      }
    });
  }
}