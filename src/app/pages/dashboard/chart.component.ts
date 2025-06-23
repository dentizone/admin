import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType, ChartDataset, registerables, Chart, ChartConfiguration } from 'chart.js';
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

  public doughnutChartLabels: string[] = [];
  public doughnutChartDatasets: ChartDataset<'doughnut'>[] = [];
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    cutout: '80%'
  };
public doughnutChartType: 'doughnut' = 'doughnut';

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postCategories']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    this.doughnutChartLabels = [];
    const dataValues: number[] = [];
    const backgroundColors: string[] = [];

    this.postCategories.forEach(category => {
      this.doughnutChartLabels.push(category.name);
      dataValues.push(category.value);
      backgroundColors.push(category.color);
    });

    this.doughnutChartDatasets = [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 0,
      }
    ];
  }
}
