import {Component, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {Filter} from "../../shared/interfaces";
import {FormsModule} from "@angular/forms";
import {MaterialDatepicker, MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-history-filter',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './history-filter.component.html',
  styleUrl: './history-filter.component.css'
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit{
  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef!: ElementRef
  @ViewChild('end') endRef!: ElementRef
  start!: MaterialDatepicker
  end!: MaterialDatepicker
  order!: number
  isValid = true

  ngOnDestroy() {
    // @ts-ignore
    this.start.destroy()
    // @ts-ignore
    this.end.destroy()
  }
  ngAfterViewInit() {
     this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
     this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
  }
  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true
      return
    }
    this.isValid = this.start.date < this.end.date
  }

  submitFilter() {
    const filter: Filter = {}
    if (this.order) {
      filter.order = this.order
    }
    if (this.start.date) {
      filter.start = this.start.date
    }
    if (this.end.date) {
      filter.end = this.end.date
    }
    this.onFilter.emit(filter)
  }
}
