import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isSidebarOpen = false;

  sidebarItems: MenuItem[] = [
    { icon: 'squares-2x2', label: 'Dashboard', route: '/dashboard', active: true },
    { icon: 'users', label: 'User Management', route: '/users' },
    { icon: 'document-text', label: 'Post Management', route: '/posts' },
    { icon: 'book-open', label: 'Catalog Management', route: '/catalog' },
    { icon: 'academic-cap', label: 'University Management', route: '/university' }
  ];

  financialItems: MenuItem[] = [
    { icon: 'credit-card', label: 'Withdrawal Requests', route: '/withdrawals' },
    { icon: 'currency-dollar', label: 'Transaction History', route: '/transactions' }
  ];

  settingsItems: MenuItem[] = [
    { icon: 'cog-6-tooth', label: 'Platform Settings', route: '/settings' }
  ];

  setActiveItem(item: MenuItem) {
    this.sidebarItems.forEach(i => i.active = false);
    this.financialItems.forEach(i => i.active = false);
    this.settingsItems.forEach(i => i.active = false);
    item.active = true;

    if (window.innerWidth < 1024) {
      this.isSidebarOpen = false;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
} 