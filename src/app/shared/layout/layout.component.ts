import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  readonly icon: 'squares-2x2' | 'users' | 'document-text' | 'book-open' | 'academic-cap' | 'credit-card' | 'currency-dollar' | 'cog-6-tooth';
  readonly label: string;
  readonly route: string;
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
  isSidebarOpen = signal(false);

  readonly sidebarItems: MenuItem[] = [
    { icon: 'squares-2x2', label: 'Dashboard', route: '/dashboard', active: true },
    { icon: 'users', label: 'User Management', route: '/users' },
    { icon: 'document-text', label: 'Post Management', route: '/posts' },
    { icon: 'book-open', label: 'Catalog Management', route: '/catalog' },
    { icon: 'academic-cap', label: 'University Management', route: '/university' }
  ];

  readonly financialItems: MenuItem[] = [
    { icon: 'credit-card', label: 'Withdrawal Requests', route: '/withdrawals' },
    { icon: 'currency-dollar', label: 'Transaction History', route: '/transactions' }
  ];

  readonly settingsItems: MenuItem[] = [
    { icon: 'cog-6-tooth', label: 'Platform Settings', route: '/settings' }
  ];

  setActiveItem(selectedItem: MenuItem): void {
    // Reset all items
    [...this.sidebarItems, ...this.financialItems, ...this.settingsItems].forEach(item => {
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
    this.isSidebarOpen.update(current => !current);
  }
} 