import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Order} from "../../shared/interfaces";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf
  ],
  templateUrl: './history-list.component.html',
  styleUrl: './history-list.component.css'
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders!: Order[]
  @ViewChild('modal') modalRef!: ElementRef
  selectedOrder!: Order
  modal!: MaterialInstance
  ngOnDestroy() {
    // @ts-ignore
    this.modal.destroy()
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0)
  }
  selectOrder(order: Order) {
    this.selectedOrder = order
    // @ts-ignore
    this.modal.open()
  }
  closeModel() {
    // @ts-ignore
    this.modal.close()
  }
}
