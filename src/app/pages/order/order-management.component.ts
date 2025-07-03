import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { OrderDetailsModalComponent } from './order-details-modal.component';
import { OrderHeaderComponent } from './order-header/order-header.compoenent';
import { OrderListComponent } from './order-lists/order-list.component';

interface Seller {
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
}

interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  totalAmount: number;
  orderShipmentAddress: { street: string; city: string } | null;
  createdAt: string;
  statusTimeline: { status: string; timestamp: string }[];
  orderItems: {
    id: string;
    postId: string;
    postTitle: string;
    price: number;
    createdAt: string;
  }[];
  sellers: Seller[];
  selected?: boolean; // Indicates if the order is selected for an action
  status?: string; // Represents the current status of the order
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    OrderHeaderComponent,
    OrderListComponent,
    OrderDetailsModalComponent,
  ],
  templateUrl: './order-management.component.html',
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  selectedStatus = 'All';
  page = 1;
  totalPages = 1;
  totalCount = 0;
  showModal = false;
  modalAction: 'delete' | 'pending' | 'processing' = 'delete';
  hoverOrder: Order | null = null; // Ensure hoverOrder is defined
  sellerName: string = '';
  buyerName: string = '';
  orderDate: Date | null = null;

  get ordersCount() {
    return {
      all: this.orders.length,
      pending: this.orders.filter((o) => o.status === 'Pending').length,
      processing: this.orders.filter((o) => o.status === 'Processing').length,
      completed: this.orders.filter((o) => o.status === 'Completed').length,
      cancelled: this.orders.filter((o) => o.status === 'Cancelled').length,
    };
  }

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const statusMap: { [key: string]: number } = {
      Pending: 1,
      Arrived: 2,
      Cancelled: 3,
      Placed: 4,
      Completed: 5,
    };

    const status =
      this.selectedStatus && this.selectedStatus !== 'All'
        ? statusMap[this.selectedStatus]
        : undefined;

    this.orderService
      .fetchOrders(
        undefined,
        this.buyerName,
        this.sellerName,
        status,
        this.page,
        this.orderDate || undefined
      )
      .subscribe({
        next: (response) => {
          this.orders = response.items;
          this.totalPages = response.totalPages;
          this.totalCount = response.totalCount;
        },
        error: (err) => {
          console.error('Failed to load orders', err);
        },
      });
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatus = status || 'All';
    this.page = 1;
    this.loadOrders();
  }

  onSellerNameChange(seller: string): void {
    this.sellerName = seller;
    this.page = 1;
    this.loadOrders();
  }

  onBuyerNameChange(buyer: string): void {
    this.buyerName = buyer;
    this.page = 1;
    this.loadOrders();
  }

  onPageChange(newPage: number): void {
    if (newPage > 0 && newPage <= this.totalPages) {
      this.page = newPage;
      this.loadOrders();
    }
  }

  onOrderDateChange(date: string): void {
    this.orderDate = date ? new Date(date) : null;
    this.page = 1;
    this.loadOrders();
  }

  get filteredOrders(): Order[] {
    return this.selectedStatus === 'All'
      ? this.orders
      : this.orders.filter((order) =>
          order.statusTimeline.some((st) => st.status === this.selectedStatus)
        );
  }

  confirmAction(action: 'delete' | 'pending' | 'processing'): void {
    this.modalAction = action;
    this.showModal = true;
  }

  performConfirmedAction(): void {
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

  deleteSelectedOrders(): void {
    this.orders = this.orders.filter((order) => !order.selected);
  }

  markSelectedAsPending(): void {
    this.orders.forEach((order) => {
      if (order.selected) {
        order.status = 'Pending';
      }
    });
  }

  markSelectedAsProcessing(): void {
    this.orders.forEach((order) => {
      if (order.selected) {
        order.status = 'Processing';
      }
    });
  }

  onOrderHover(order: Order): void {
    this.hoverOrder = order;
  }

  clearHover(): void {
    this.hoverOrder = null;
  }

  completeHoverOrder(): void {
    if (this.hoverOrder) {
      this.hoverOrder.status = 'Completed';
      this.clearHover();
    }
  }

  cancelHoverOrder(): void {
    if (this.hoverOrder) {
      this.hoverOrder.status = 'Cancelled';
      this.clearHover();
    }
  }
}
