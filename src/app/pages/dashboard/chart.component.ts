import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ChartDataset,
  registerables,
  Chart,
  ChartConfiguration,
} from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { PostCategory } from '../../core/models/post-category.model';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() postCategories: PostCategory[] = [];
  @Input() pieChartData: PostCategory[] = [];
  @Input() chartType: 'doughnut' | 'pie' = 'doughnut';
  @Input() title: string = '';
  @Input() expandable: boolean = false;
  expanded = false;

  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartDataset<'doughnut'>[] = [];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '80%',
  };
  public doughnutChartType = 'doughnut' as const;

  public pieChartLabels: string[] = [];
  public pieChartDatasets: ChartDataset<'pie'>[] = [];
  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  public pieChartType = 'pie' as const;

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postCategories']) {
      this.updateChartData();
    }
    if (changes['pieChartData']) {
      this.updatePieChartData();
    }
  }

  private updateChartData(): void {
    this.doughnutChartLabels = [];
    const dataValues: number[] = [];
    const backgroundColors: string[] = [];

    if (
      !Array.isArray(this.postCategories) ||
      this.postCategories.length === 0
    ) {
      // No data to display
      this.doughnutChartDatasets = [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
        },
      ];
      return;
    }

    this.postCategories.forEach((category) => {
      // Validate category properties
      const name =
        typeof category.name === 'string' && category.name.trim() !== ''
          ? category.name
          : 'Unknown';
      const value =
        typeof category.value === 'number' && !isNaN(category.value)
          ? category.value
          : 0;
      const color =
        typeof category.color === 'string' && category.color.trim() !== ''
          ? category.color
          : '#CCCCCC';

      // Optionally skip categories with missing/invalid name or value
      if (name === 'Unknown' && value === 0) {
        return; // skip completely invalid entry
      }

      this.doughnutChartLabels.push(name);
      dataValues.push(value);
      backgroundColors.push(color);
    });

    this.doughnutChartDatasets = [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ];
  }

  private updatePieChartData(): void {
    this.pieChartLabels = [];
    const dataValues: number[] = [];
    const backgroundColors: string[] = [];
    if (!Array.isArray(this.pieChartData) || this.pieChartData.length === 0) {
      this.pieChartDatasets = [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
        },
      ];
      return;
    }
    this.pieChartData.forEach((category) => {
      const name =
        typeof category.name === 'string' && category.name.trim() !== ''
          ? category.name
          : 'Unknown';
      const value =
        typeof category.value === 'number' && !isNaN(category.value)
          ? category.value
          : 0;
      const color =
        typeof category.color === 'string' && category.color.trim() !== ''
          ? category.color
          : '#CCCCCC';
      if (name === 'Unknown' && value === 0) {
        return;
      }
      this.pieChartLabels.push(name);
      dataValues.push(value);
      backgroundColors.push(color);
    });
    this.pieChartDatasets = [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      },
    ];
  }

  get visibleCategories(): PostCategory[] {
    if (!this.expandable) return this.postCategories;
    return this.expanded
      ? this.postCategories
      : this.postCategories.slice(0, 6);
  }

  toggleExpanded() {
    if (this.expandable) {
      this.expanded = !this.expanded;
    }
  }
}
