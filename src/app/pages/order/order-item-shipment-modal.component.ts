import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShipmentService } from '../../core/services/shipment.service';

export interface ShipmentStatusHistory {
  id: string;
  itemName: string;
  shipmentActivityStatus: number;
  timestamp: string;
  comment: string;
}

@Component({
  selector: 'app-order-item-shipment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-item-shipment-modal.component.html',
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
export class OrderItemShipmentModalComponent {
  @Input() item: any; // order item
  @Input() shipmentHistory: ShipmentStatusHistory[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() shipmentUpdated = new EventEmitter<void>();

  toastMessage: string | null = null;
  toastType: 'success' | 'error' | null = null;
  selectedStatus: number = 0;
  comment: string = '';
  shipmentStatusOptions = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Picked Up' },
    { value: 2, label: 'Shipped' },
    { value: 3, label: 'Delivered' },
    { value: 4, label: 'Cancelled' },
  ];
  private toastTimeoutId: any;

  constructor(private readonly shipmentService: ShipmentService) {}

  getShipmentStatusLabel(status: number): string {
    const found = this.shipmentStatusOptions.find(
      (opt) => opt.value === status
    );
    return found ? found.label : status.toString();
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

  addShipmentStatus() {
    if (
      !this.item?.id ||
      this.selectedStatus === null ||
      this.selectedStatus === undefined ||
      isNaN(this.selectedStatus)
    ) {
      this.showToast('Invalid shipment status or item ID.', 'error');
      return;
    }
    this.shipmentService
      .adjustShipment(this.item.id, Number(this.selectedStatus), this.comment)
      .subscribe({
        next: () => {
          this.showToast('Shipment status updated successfully!', 'success');
          this.shipmentUpdated.emit();
          this.comment = '';
        },
        error: () => {
          this.showToast('Failed to update shipment status.', 'error');
        },
      });
  }
}
