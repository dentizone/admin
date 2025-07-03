import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule,FormsModule],
  templateUrl: './login-page.html'
})
export class LoginPage {

  constructor(private service:Login, private route:Router){}
  userEmail=''
  userPass=''
  onSubmit(){
    this.service.checkLogin(this.userEmail,this.userPass).subscribe({
      next: data=>{
        console.log('success');
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        this.route.navigate(['/dashboard']);

      },
      error: err=>{
        console.log('fail',this.userEmail,' ',this.userPass,' ',err)
      }
    })
  }
}
