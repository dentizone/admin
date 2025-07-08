import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';
import { Login } from '../../pages/login/login';

interface MenuItem {
  readonly icon: string;
  readonly label: string;
  readonly route: string;
  active?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = signal(false);
  user: any = null;
  loadingUser = false;
  globalLoading = false;

  readonly sidebarItems: MenuItem[] = [
    {
      icon: 'squares-2x2',
      label: 'Dashboard',
      route: '/dashboard',
      active: false,
    },
    { icon: 'users', label: 'User Management', route: '/users' },
    { icon: 'document-text', label: 'Post Management', route: '/posts' },
    { icon: 'shopping-bag', label: 'Order Management', route: '/orders' },
    { icon: 'book-open', label: 'Catalog Management', route: '/catalog' },
    {
      icon: 'academic-cap',
      label: 'University Management',
      route: '/university',
    },
    {
      icon: 'review-icon',
      label: 'Feedback Management',
      route: '/feedback',
    },
  ];

  readonly financialItems: MenuItem[] = [
    {
      icon: 'credit-card',
      label: 'Withdrawal Requests',
      route: '/withdrawals',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly login: Login,
    private readonly loading: LoadingService
  ) {
    this.setActiveByRoute(this.router.url);
    this.router.events.subscribe(() => {
      this.setActiveByRoute(this.router.url);
    });
    this.loading.loading$.subscribe((val) => (this.globalLoading = val));
  }

  ngOnInit() {
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.loadingUser = true;
    this.http.get('https://apit.gitnasr.com/api/Users/me').subscribe({
      next: (user) => {
        this.user = user;
        this.loadingUser = false;
      },
      error: () => {
        this.user = null;
        this.loadingUser = false;
      },
    });
  }

  logout() {
    this.login.logout();
  }

  setActiveByRoute(url: string): void {
    const allItems = [...this.sidebarItems, ...this.financialItems];
    allItems.forEach((item) => {
      item.active = url.startsWith(item.route);
    });
  }

  setActiveItem(selectedItem: MenuItem): void {
    // Reset all items
    [...this.sidebarItems, ...this.financialItems].forEach((item) => {
      item.active = false;
    });

    // Set selected item as active
    selectedItem.active = true;

    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      this.isSidebarOpen.set(false);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((current) => !current);
  }
}
