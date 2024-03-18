import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HistoryFilterComponent} from "./history-filter/history-filter.component";
import {HistoryListComponent} from "./history-list/history-list.component";
import {NgClass, NgIf} from "@angular/common";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderServices} from "../order-page/order.services";
import {OrdersServices} from "../shared/services/orders.services";
import {Subscription} from "rxjs";
import {Filter, Order} from "../shared/interfaces";
import {LoaderComponent} from "../shared/components/loader/loader.component";

const STEP = 2
@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    HistoryFilterComponent,
    HistoryListComponent,
    NgIf,
    NgClass,
    LoaderComponent
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.css'
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef
  tooltip!: MaterialInstance
  isFilterVisible = false
  oSub!: Subscription
  orders: Order[] = []
  filter: Filter = {}

  offset = 0
  limit = STEP
  loading = false
  reloading = false
  noMoreOrders = false
  constructor(private ordersService: OrdersServices) {
  }
  ngOnInit() {
    this.loading = true
    this.fetch()
  }
  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })
     this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
       this.noMoreOrders = orders.length < STEP
       this.loading = false
       this.reloading = false
    })
  }
  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }
  ngOnDestroy() {
    // @ts-ignore
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }
  applyFilter(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }
  ngAfterViewInit() {
     this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }
  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }
}
