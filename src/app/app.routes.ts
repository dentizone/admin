import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { UniversityComponent } from './pages/university/university.component';
import { OrderManagementComponent } from './pages/order/order-management.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: PlaceholderComponent },
      { path: 'posts', component: PlaceholderComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'catalog', component: PlaceholderComponent },
      { path: 'university', component: UniversityComponent },
      { path: 'withdrawals', component: PlaceholderComponent },
      { path: 'transactions', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent }
    ]
  }
];
