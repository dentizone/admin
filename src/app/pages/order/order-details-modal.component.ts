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
import { ShipmentService } from '../../core/services/shipment.service';
import { Order } from '../../shared/interfaces/order.interface';
import { getSellerInitials } from '../../shared/utils/seller.utils';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  constructor(private readonly shipmentService: ShipmentService) {}

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

  showToast(message: string) {
    this.toastMessage = message;
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
    }
    this.toastTimeoutId = setTimeout(() => {
      this.toastMessage = null;
      this.toastTimeoutId = null;
    }, 2500);
  }

  adjustShipment(item: any) {
    const state = this.shipmentFormState[item.id] || {
      selectedShipmentStatus: 0,
      shipmentComment: '',
    };
    const status = state.selectedShipmentStatus;
    const comment = state.shipmentComment;
    this.shipmentService.adjustShipment(item.id, status, comment).subscribe({
      next: () => {
        this.showToast('Shipment status updated successfully!');
      },
      error: () => {
        this.showToast('Failed to update shipment status.');
      },
    });
  }

  ngOnDestroy() {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  }
}
