import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CardDetails } from '../../../core/models/card.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  readonly card = input<CardDetails>();

    private sanitizer = inject(DomSanitizer);
  defaultIconSvg: string | undefined;

  get safeIcon(): SafeHtml {
    const rawSvg = this.card()?.icon ?? this.defaultIconSvg;
    return this.sanitizer.bypassSecurityTrustHtml(rawSvg!);
  }

  get isPositiveChange(): boolean {
    const c = this.card();
    const change = c?.change ?? '';
    const title = c?.title ?? '';

    return (
      ((title === 'Total Posts' || title === 'Total Users' || title === 'Total Revenue' || title === 'New Signups') && change.startsWith('+')) ||
      ((title === 'Pending Posts' || title === 'Pending KYC') && change.startsWith('-'))
    );
  }

  get isNegativeChange(): boolean {
    return !this.isPositiveChange;
  }
}
