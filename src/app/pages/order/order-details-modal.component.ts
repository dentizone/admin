import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShipmentService } from '../../core/services/shipment.service';

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
    pickupLocation?: string;
  }[];
  sellers: Seller[];
}

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Toast Notification -->
    <div
      *ngIf="toastMessage"
      class="fixed top-6 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition bg-green-600 animate-fade-in"
    >
      {{ toastMessage }}
    </div>
    <div
      class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-60"
      (click)="close.emit()"
    >
      <div
        class="relative w-full max-w-2xl mx-2 bg-white border-l-8 border-indigo-400 rounded-2xl shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]"
        (click)="$event.stopPropagation()"
      >
        <div class="p-6 md:p-10">
          <div class="flex gap-3 items-center mb-6">
            <svg
              class="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 17v-2a4 4 0 014-4h3m-7 6v2a4 4 0 004 4h3m-7-6H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4"
              />
            </svg>
            <h2 class="text-3xl font-extrabold text-indigo-900">
              Order Details
            </h2>
          </div>
          <div class="flex flex-col gap-10 md:flex-row">
            <!-- Left: Main Info -->
            <div class="flex-1 space-y-6">
              <div
                class="flex gap-2 items-center text-lg font-semibold text-indigo-900"
              >
                <!-- Buyer icon -->
                <svg
                  class="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {{ order?.buyerName }}
              </div>
              <div class="flex gap-2 items-center text-gray-600">
                <!-- Calendar icon -->
                <svg
                  class="w-5 h-5 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span>{{ order?.createdAt | date : 'medium' }}</span>
              </div>
              <div class="flex gap-2 items-center text-gray-600">
                <!-- Money icon -->
                <svg
                  class="w-5 h-5 text-teal-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="12" x="2" y="6" rx="2" />
                  <path d="M6 10h.01M18 10h.01" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span class="text-lg font-bold text-indigo-900">{{
                  order?.totalAmount | currency
                }}</span>
              </div>
              <div
                class="flex gap-2 items-center text-gray-600"
                *ngIf="order?.orderShipmentAddress"
              >
                <!-- Map pin icon -->
                <svg
                  class="w-5 h-5 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span
                  >{{ order?.orderShipmentAddress?.street }},
                  {{ order?.orderShipmentAddress?.city }}</span
                >
              </div>
              <div class="my-6 border-t border-indigo-100"></div>
              <div>
                <div
                  class="flex gap-2 items-center mb-2 font-semibold text-gray-700"
                >
                  <!-- Users/Group icon -->
                  <svg
                    class="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Sellers
                </div>
                <div class="flex flex-wrap gap-3">
                  <ng-container *ngIf="order?.sellers as sellers">
                    <ng-container *ngIf="sellers.length > 0; else noSellers">
                      <div
                        *ngFor="let seller of sellers"
                        class="flex gap-2 items-center px-3 py-1 bg-purple-50 rounded-lg shadow-sm"
                      >
                        <div
                          class="flex justify-center items-center w-8 h-8 text-xs font-bold text-purple-700 bg-purple-200 rounded-full"
                        >
                          {{ getSellerInitials(seller?.sellerName ?? '') }}
                        </div>
                        <div>
                          <div class="font-semibold text-purple-900">
                            {{ seller?.sellerName }}
                          </div>
                          <div class="text-xs text-gray-500">
                            {{ seller?.sellerEmail }}
                          </div>
                        </div>
                      </div>
                    </ng-container>
                  </ng-container>
                  <ng-template #noSellers
                    ><span class="text-gray-400">No sellers</span></ng-template
                  >
                </div>
              </div>
            </div>
            <!-- Right: Timeline & Items -->
            <div class="flex-1 space-y-8">
              <div>
                <div
                  class="flex gap-2 items-center mb-2 font-semibold text-gray-700"
                >
                  <!-- Clock/History icon -->
                  <svg
                    class="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6l4 2"
                    />
                  </svg>
                  Status Timeline
                </div>
                <ul class="relative pl-8 border-l border-indigo-100">
                  <ng-container *ngIf="order?.statusTimeline as timeline">
                    <ng-container *ngIf="timeline.length > 0">
                      <li
                        *ngFor="let status of timeline; let i = index"
                        class="flex items-center gap-3 mb-4 last:mb-0 min-h-[2.5rem]"
                      >
                        <div class="flex flex-col items-center w-4">
                          <span
                            class="w-3 h-3 rounded-full border-2 border-white shadow"
                            [ngClass]="{
                              'bg-blue-400': status.status === 'Arrived',
                              'bg-yellow-400': status.status === 'Pending',
                              'bg-rose-400': status.status === 'Cancelled',
                              'bg-purple-400': status.status === 'Placed',
                              'bg-teal-400': status.status === 'Completed',
                              'bg-gray-200': !status.status
                            }"
                          ></span>
                          <span
                            *ngIf="i < timeline.length - 1"
                            class="w-0.5 flex-1 bg-indigo-100"
                          ></span>
                        </div>
                        <div
                          class="flex flex-col gap-1 md:flex-row md:items-center md:gap-3"
                        >
                          <span class="font-semibold text-gray-700">{{
                            status.status
                          }}</span>
                          <span class="text-xs text-gray-500">{{
                            status.timestamp | date : 'short'
                          }}</span>
                        </div>
                      </li>
                    </ng-container>
                  </ng-container>
                </ul>
              </div>
              <div class="border-t border-indigo-100"></div>
              <div>
                <div
                  class="flex gap-2 items-center mb-2 font-semibold text-gray-700"
                >
                  <!-- Shopping bag/cart icon -->
                  <svg
                    class="w-5 h-5 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5.5 8h13l-1.5 9h-10l-1.5-9z"
                    />
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="15" cy="21" r="1" />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7 8V6a5 5 0 0110 0v2"
                    />
                  </svg>
                  Order Items
                </div>
                <ul class="flex flex-col gap-6">
                  <ng-container *ngIf="order?.orderItems as items">
                    <ng-container *ngIf="items.length > 0">
                      <li
                        *ngFor="let item of items"
                        class="flex flex-col gap-4 p-6 rounded-2xl border border-indigo-50 shadow-lg backdrop-blur-md bg-white/80"
                      >
                        <div class="flex flex-col gap-1">
                          <div class="flex gap-2 items-center">
                            <span class="text-lg font-bold text-indigo-900">{{
                              item?.postTitle
                            }}</span>
                            <span
                              class="text-lg font-semibold text-emerald-600"
                              >{{ item?.price | currency }}</span
                            >
                          </div>
                          <div
                            *ngIf="item?.pickupLocation"
                            class="flex gap-2 items-center mt-1 text-sm text-gray-500"
                          >
                            <svg
                              class="w-4 h-4 text-rose-400"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 21c-4.418 0-8-4.03-8-9a8 8 0 1116 0c0 4.97-3.582 9-8 9z"
                              />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>{{ item.pickupLocation }}</span>
                          </div>
                        </div>
                        <div class="flex flex-col gap-3 mt-2">
                          <label class="text-xs font-medium text-gray-500"
                            >Shipment Status</label
                          >
                          <select
                            class="px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            [(ngModel)]="
                              shipmentFormState[item.id].selectedShipmentStatus
                            "
                          >
                            <option
                              *ngFor="let status of shipmentStatusOptions"
                              [value]="status.value"
                            >
                              {{ status.label }}
                            </option>
                          </select>
                          <input
                            type="text"
                            class="px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Comment (اختياري)"
                            [(ngModel)]="
                              shipmentFormState[item.id].shipmentComment
                            "
                          />
                          <button
                            class="py-2 mt-1 w-full font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-md transition hover:from-blue-700 hover:to-indigo-600"
                            (click)="adjustShipment(item)"
                          >
                            Adjust Shipment
                          </button>
                        </div>
                      </li>
                    </ng-container>
                  </ng-container>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
export class OrderDetailsModalComponent implements OnChanges {
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
  constructor(private shipmentService: ShipmentService) {}

  ngOnChanges() {
    if (this.order?.orderItems) {
      for (const item of this.order.orderItems) {
        if (!this.shipmentFormState[item.id]) {
          this.shipmentFormState[item.id] = {
            selectedShipmentStatus: 0, // TODO: set from real item status if available
            shipmentComment: '',
          };
        }
      }
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = null;
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
