import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnalyticsServices} from "../shared/services/analytics.services";
import {Observable} from "rxjs";
import {OverviewPage} from "../shared/interfaces";
import {AsyncPipe, DatePipe, NgClass, NgIf} from "@angular/common";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    LoaderComponent,
    NgClass,
    DatePipe
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css',
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef
  tabTarget!: MaterialInstance
  data$!: Observable<OverviewPage>

  yesterday = new Date()
  constructor(private service: AnalyticsServices) {
  }
  ngOnInit() {
     this.data$ = this.service.getOverview()

    this.yesterday.setDate(this.yesterday.getDate() - 1)
  }
  ngAfterViewInit() {
    this.tabTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }
  ngOnDestroy() {
    // @ts-ignore
    this.tabTarget.destroy()
  }
  openInfo() {
    // @ts-ignore
    this.tabTarget.open()
  }
}
