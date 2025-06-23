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

    private readonly sanitizer = inject(DomSanitizer);
  defaultIconSvg: string | undefined;

  get safeIcon(): SafeHtml {
    const rawSvg = this.card()?.icon ?? this.defaultIconSvg;
    return this.sanitizer.bypassSecurityTrustHtml(rawSvg!);
  }

  get isPositiveChange(): boolean {
    const c = this.card();
    if (c?.changeType === 'positive') return true;
    if (c?.changeType === 'negative') return false;
    // Treat 'neutral' or undefined as not positive
    return false;
  }

  get isNegativeChange(): boolean {
    return !this.isPositiveChange;
  }
}
