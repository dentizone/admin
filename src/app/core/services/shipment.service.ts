import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
  constructor(private http: HttpClient) {}

  adjustShipment(
    orderItemId: string,
    newStatus: number,
    comment: string
  ): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/Shipping`, null, {
      params: {
        orderItemId,
        newStatus: newStatus.toString(),
        comment: comment || '',
      },
    });
  }
}
