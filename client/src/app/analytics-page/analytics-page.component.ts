import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {AnalyticsServices} from "../shared/services/analytics.services";
import {AnalyticsPage, ChartConfig} from "../shared/interfaces";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {NgIf} from "@angular/common";
import {Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import {Subscription} from "rxjs";




@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf
  ],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.css'
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef!: ElementRef
  @ViewChild('order') orderRef!: ElementRef
  aSub!: Subscription
  average!: number
  pending = true

  constructor(private service: AnalyticsServices) {
  }

  ngAfterViewInit() {
    const gainConfig: any =
    {
      label: 'Виручка',
      color: 'rgb(255, 99, 132)'
    }
    const orderConfig: any =
    {
      label: 'Замовлення',
      color: 'rgb(54, 162, 235)'
    }
    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average
      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)
      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)



      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'
      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))
      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);
function createChartConfig({ labels, data, label, color }: ChartConfig) {
  return {
    type: 'line' as const,
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
