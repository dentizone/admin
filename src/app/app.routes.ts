import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: PlaceholderComponent },
      { path: 'posts', component: PlaceholderComponent },
      { path: 'catalog', component: PlaceholderComponent },
      { path: 'university', component: PlaceholderComponent },
      { path: 'withdrawals', component: PlaceholderComponent },
      { path: 'transactions', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent }
    ]
  }
];
