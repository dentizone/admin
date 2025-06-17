import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <div class="bg-white rounded-lg shadow p-6 text-center">
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
        <p class="text-gray-500">This feature is currently under development.</p>
      </div>
    </div>
  `
})
export class PlaceholderComponent {} 