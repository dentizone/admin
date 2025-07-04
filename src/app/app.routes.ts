import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderManagementComponent } from './pages/order/order-management.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { UniversityComponent } from './pages/university/university.component';
import { LayoutComponent } from './shared/layout/layout.component';

import { AuthGuard } from './core/guards/auth.guard';
import { LoginPage } from './pages/login/login-page/login-page';
import { UserManagement } from './pages/userManagment/user-management/user-management';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserManagement },
      { path: 'posts', component: PlaceholderComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'catalog', component: PlaceholderComponent },
      { path: 'university', component: UniversityComponent },
      { path: 'withdrawals', component: PlaceholderComponent },
      { path: 'transactions', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent },
    ],
  },
  { path: 'login', component: LoginPage },
];
