import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {OrderServices} from "./order.services";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrdersServices} from "../shared/services/orders.services";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './order-page.component.html',
  styleUrl: './order-page.component.css',
  providers: [OrderServices]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef
  modal!: MaterialInstance
  oSub!: Subscription
  isRoot!: boolean
  pending = false
  constructor(private router: Router, protected order: OrderServices, private ordersServices: OrdersServices) {
  }
  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
      this.isRoot = this.router.url === '/order'
    })
  }
  ngOnDestroy() {
    // @ts-ignore
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }
  ngAfterViewInit() {
     this.modal = MaterialService.initModal(this.modalRef)
  }
  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }

  open() {
    // @ts-ignore
    this.modal.open()
  }
  cancel() {
    // @ts-ignore
    this.modal.close()
  }
  submit() {
    this.pending = true
    // @ts-ignore
    this.modal.close()

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id
        return item
      })
    }
    this.oSub = this.ordersServices.create(order).subscribe(
      newOrder => {
        MaterialService.toast(`Замовлення №${newOrder.order} добавлено`)
        this.order.clear()
      },
      error => MaterialService.toast(error.error.message),
      () => {
        // @ts-ignore
        this.modal.close()
        this.pending = false
      }
    )
  }
}
