import { Component } from '@angular/core';
import { ToastComponent } from "../../../shared/components/toast-component/toast-component";

@Component({
  selector: 'app-with-drawal-req',
  imports: [ToastComponent],
  templateUrl: './with-drawal-req.html',
  styleUrl: './with-drawal-req.css'
})
export class WithDrawalReq {

  viewToast=false;
  isToastSuccess=true;
  toastMessage=''
}
