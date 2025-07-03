import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
}

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-60"
      (click)="close.emit()"
    >
      <div
        class="relative w-full max-w-2xl mx-2 bg-white border-l-8 border-indigo-400 rounded-2xl shadow-2xl animate-scale-in overflow-y-auto max-h-[90vh]"
        (click)="$event.stopPropagation()"
      >
        <button
          (click)="close.emit()"
          class="float-right sticky top-0 right-0 z-10 p-2 m-4 text-2xl text-gray-400 bg-white rounded-full shadow-md transition-colors hover:text-rose-500"
        >
          <span class="sr-only">Close</span>&times;
        </button>
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
                    d="M16 7a4 4 0 01-8 0"
                  />
                </svg>
                {{ order?.buyerName }}
              </div>
              <div class="flex gap-2 items-center text-gray-600">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{{ order?.createdAt | date : 'medium' }}</span>
              </div>
              <div class="flex gap-2 items-center text-gray-600">
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
                    d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                  />
                </svg>
                <span class="text-lg font-bold text-indigo-900">{{
                  order?.totalAmount | currency
                }}</span>
              </div>
              <div
                class="flex gap-2 items-center text-gray-600"
                *ngIf="order?.orderShipmentAddress"
              >
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
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
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
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
                      d="M9 17v-2a4 4 0 014-4h3"
                    />
                  </svg>
                  Status Timeline
                </div>
                <ul class="relative pl-6 border-l-2 border-indigo-100">
                  <ng-container *ngIf="order?.statusTimeline as timeline">
                    <ng-container *ngIf="timeline.length > 0">
                      <li
                        *ngFor="let status of timeline; let i = index"
                        class="flex relative gap-3 items-center mb-4 last:mb-0"
                      >
                        <span
                          class="flex absolute -left-6 justify-center items-center w-4 h-4 rounded-full border-2 border-white shadow"
                          [ngClass]="{
                            'bg-yellow-300': status.status === 'Pending',
                            'bg-blue-300': status.status === 'Arrived',
                            'bg-rose-300': status.status === 'Cancelled',
                            'bg-purple-300': status.status === 'Placed',
                            'bg-teal-300': status.status === 'Completed',
                            'bg-gray-200': !status.status
                          }"
                        ></span>
                        <span class="font-semibold text-gray-700">{{
                          status.status
                        }}</span>
                        <span class="text-xs text-gray-500">{{
                          status.timestamp | date : 'short'
                        }}</span>
                        <span
                          *ngIf="i < timeline.length - 1"
                          class="absolute left-[-1.1rem] top-4 w-0.5 h-6 bg-indigo-100"
                        ></span>
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
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                  Order Items
                </div>
                <ul class="space-y-1">
                  <ng-container *ngIf="order?.orderItems as items">
                    <ng-container *ngIf="items.length > 0">
                      <li
                        *ngFor="let item of items"
                        class="flex gap-2 items-center"
                      >
                        <span class="font-semibold text-gray-800">{{
                          item?.postTitle
                        }}</span>
                        <span class="text-teal-700">{{
                          item?.price | currency
                        }}</span>
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
    `,
  ],
})
export class OrderDetailsModalComponent {
  @Input() order: Order | null = null;
  @Output() close = new EventEmitter<void>();

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
