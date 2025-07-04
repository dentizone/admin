import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${environment.apiBaseUrl}/Order/all`;

  constructor(private readonly http: HttpClient) {}

  fetchOrders(
    orderId?: string,
    buyerName?: string,
    sellerName?: string,
    status?: number,
    page: number = 1,
    orderDate?: Date
  ): Observable<any> {
    let params = new HttpParams();

    if (orderId) {
      params = params.set('OrderId', orderId);
    }
    if (buyerName) {
      params = params.set('BuyerName', buyerName);
    }
    if (sellerName) {
      params = params.set('SellerName', sellerName);
    }
    if (status !== undefined) {
      params = params.set('Status', status.toString());
    }
    if (orderDate) {
      const formattedDate = orderDate.toISOString().split('T')[0]; // yyyy-MM-dd
      params = params.set('OrderDate', formattedDate);
    }
    params = params.set('page', page.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  updateOrderStatus(orderId: string, status: number): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/Order/${orderId}/status`,
      status,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  confirmOrder(orderId: string): Observable<any> {
    // Assuming 5 is the status code for 'Completed'
    return this.updateOrderStatus(orderId, 5);
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/Order/${orderId}/cancel`,
      {}
    );
  }
}
