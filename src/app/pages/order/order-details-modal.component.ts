import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { ShipmentService } from '../../core/services/shipment.service';
import { Order } from '../../shared/interfaces/order.interface';
import { getSellerInitials } from '../../shared/utils/seller.utils';
import {
  OrderItemShipmentModalComponent,
  ShipmentStatusHistory,
} from './order-item-shipment-modal.component';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderItemShipmentModalComponent],
  templateUrl: './order-details-modal.component.html',
  styles: [
    `
      .animate-scale-in {
        animation: scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      @keyframes scaleIn {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class OrderDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() order: Order | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() shipmentUpdated = new EventEmitter<void>();
  toastType: 'success' | 'error' | null = null;
  shipmentStatusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Picked Up' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' },
  ];
  toastMessage: string | null = null;
  shipmentFormState: {
    [itemId: string]: {
      selectedShipmentStatus: number;
      shipmentComment: string;
    };
  } = {};
  public getSellerInitials = getSellerInitials;
  private toastTimeoutId: any;
  selectedOrderItem: any = null;
  selectedOrderItemShipmentHistory: ShipmentStatusHistory[] = [];
  orderStatusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Arrived' },
    { value: 3, label: 'Cancelled' },
    { value: 4, label: 'Placed' },
    { value: 5, label: 'Completed' },
  ];
  selectedOrderStatus: number | null = null;
  isUpdatingOrderStatus = false;
  isConfirmingOrder = false;
  isCancellingOrder = false;
  constructor(
    private readonly shipmentService: ShipmentService,
    private readonly orderService: OrderService
  ) {}

  ngOnChanges() {
    if (this.order?.orderItems) {
      for (const item of this.order.orderItems) {
        if (!this.shipmentFormState[item.id]) {
          this.shipmentFormState[item.id] = {
            selectedShipmentStatus: 0,
            shipmentComment: '',
          };
        }
      }
    }
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
    this.toastTimeoutId = setTimeout(() => {
      this.toastMessage = null;
      this.toastType = null;
      this.toastTimeoutId = null;
    }, 2500);
  }

  adjustShipment(item: any) {
    if (this.order?.status === 'Cancelled' || this.order?.status === 'Closed') {
      this.showToast(
        'Cannot update shipment for closed or cancelled orders.',
        'error'
      );
      return;
    }
    const state = this.shipmentFormState[item.id] || {
      selectedShipmentStatus: 0,
      shipmentComment: '',
    };
    const status = Number(state.selectedShipmentStatus);
    const comment = state.shipmentComment;
    // Debug log
    console.log('Adjusting shipment:', { orderItemId: item.id, status });
    if (!item.id || status === null || status === undefined || isNaN(status)) {
      this.showToast('Invalid shipment status or item ID.', 'error');
      return;
    }
    this.shipmentService.adjustShipment(item.id, status, comment).subscribe({
      next: () => {
        this.showToast('Shipment status updated successfully!', 'success');
        this.shipmentUpdated.emit();
        setTimeout(()=>{this.close.emit()},1000)
      },
      error: () => {
        this.showToast('Failed to update shipment status.', 'error');
        setTimeout(()=>{this.close.emit()},1000)
      },
    });
  }

  openShipmentModal(item: any) {
    this.selectedOrderItem = item;
    // Find shipment history for this item from order.shipmentStatus
    this.selectedOrderItemShipmentHistory = (
      this.order?.shipmentStatus || []
    ).filter((s: any) => s.itemName === item.postTitle || s.id === item.id);
  }
  closeShipmentModal(refresh: boolean = false) {
    this.selectedOrderItem = null;
    this.selectedOrderItemShipmentHistory = [];
    if (refresh) {
      this.shipmentUpdated.emit();
    }
  }

  updateOrderStatus() {
    if (!this.order?.id || this.selectedOrderStatus === null) return;
    this.isUpdatingOrderStatus = true;
    this.orderService
      .updateOrderStatus(this.order.id, this.selectedOrderStatus)
      .subscribe({
        next: () => {
          this.showToast('Order status updated successfully!', 'success');
          this.isUpdatingOrderStatus = false;
          this.shipmentUpdated.emit();
          setTimeout(()=>{this.close.emit()},1000)
        },
        error: () => {
          this.showToast('Failed to update order status.', 'error');
          setTimeout(()=>{this.close.emit()},1000)
          this.isUpdatingOrderStatus = false;
          
        },
      });
  }
  confirmOrder() {
    if (!this.order?.id) return;
    this.isConfirmingOrder = true;
    this.orderService.confirmOrder(this.order.id).subscribe({
      next: () => {
        this.showToast('Order confirmed as complete!', 'success');
        this.isConfirmingOrder = false;
        this.shipmentUpdated.emit();
         setTimeout(()=>{this.close.emit()},1000)
      },
      error: () => {
        
        this.showToast('Failed to confirm order.', 'error');
        this.isConfirmingOrder = false;
        setTimeout(()=>{this.close.emit()},1000)
      },
    });
  }
  cancelOrder() {
    if (!this.order?.id) return;
    this.isCancellingOrder = true;
    this.orderService.cancelOrder(this.order.id).subscribe({
      next: () => {
        this.showToast('Order cancelled successfully!', 'success');
        this.isCancellingOrder = false;
        
        this.shipmentUpdated.emit();
        setTimeout(()=>{this.close.emit()},1000)
      },
      error: () => {
        this.showToast('Failed to cancel order.', 'error');
        
        this.isCancellingOrder = false;
        setTimeout(()=>{this.close.emit()},1000)
      },
    });
  }

  get actionsDisabled(): boolean {
    const status = this.order?.status?.toLowerCase();
    return (
      status === 'arrived' || status === 'cancelled' || status === 'completed'
    );
  }

  ngOnDestroy() {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  }
}
