import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FeedbackPageComponent } from './pages/feedback/feedback-page/feedback-page';
import { OrderManagementComponent } from './pages/order/order-management.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';
import { UniversityComponent } from './pages/university/university.component';
import { LayoutComponent } from './shared/layout/layout.component';

import { AuthGuard } from './core/guards/auth.guard';
import { ActivityComponent } from './pages/activity/activity.component';
import { CatalogManagement } from './pages/catalogManagement/catalog-management/catalog-management';
import { LoginPage } from './pages/login/login-page/login-page';
import { PostManagementComponent } from './pages/PostManagement/post-management-component/post-management-component';
import { UserManagement } from './pages/userManagment/user-management/user-management';
import { WithDrawalReq } from './pages/withDrawalReq/with-drawal-req/with-drawal-req';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UserManagement },
      { path: 'posts', component: PostManagementComponent },
      { path: 'catalog', component: CatalogManagement },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'university', component: UniversityComponent },
      { path: 'withdrawals', component: WithDrawalReq },
      { path: 'transactions', component: PlaceholderComponent },
      { path: 'settings', component: PlaceholderComponent },
      { path: 'feedback', component: FeedbackPageComponent },
      { path: 'activity', component: ActivityComponent },
    ],
  },
  { path: 'login', component: LoginPage },
];
