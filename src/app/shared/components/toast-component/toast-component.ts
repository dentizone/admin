import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-component',
  imports: [CommonModule],
  templateUrl: './toast-component.html',
  
})
export class ToastComponent {

  @Input() message:string='';
  @Input() isSuccess:boolean=true;
}
