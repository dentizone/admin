import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdjustShipmentResponse {
  success: boolean;
  message?: string;
  // Add more fields as needed based on actual API response
}

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  constructor(private http: HttpClient) {}

  adjustShipment(
    orderItemId: string,
    newStatus: number,
    comment: string
  ): Observable<AdjustShipmentResponse> {
    if (!orderItemId || typeof newStatus !== 'number') {
      throw new Error(
        'orderItemId and newStatus are required and must be valid.'
      );
    }
    const body = {
      orderItemId,
      newStatus,
      comment: comment || '',
    };
    return this.http.put<AdjustShipmentResponse>(
      `${environment.apiBaseUrl}/Shipping`,
      body
    );
  }
}
