import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdjustShipmentResponse {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  constructor(private readonly http: HttpClient) {}

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
    return this.http.post<AdjustShipmentResponse>(
      `${environment.apiBaseUrl}/Shipping`,
      body
    );
  }
}
