import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsServicrs} from "../../shared/services/positions.servicrs";
import {map, Observable} from "rxjs";
import {Position} from "../../shared/interfaces";
import {switchMap} from "rxjs/operators";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {OrderServices} from "../order.services";
import {MaterialService} from "../../shared/classes/material.service";

@Component({
  selector: 'app-order-positions',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    FormsModule
  ],
  templateUrl: './order-positions.component.html',
  styleUrl: './order-positions.component.css'
})
export class OrderPositionsComponent implements OnInit {
  position$!: Observable<Position[]>
  position!: Position;
  constructor(private route: ActivatedRoute, private positionsService: PositionsServicrs, private order: OrderServices) {
  }
  ngOnInit() {
     this.position$ = this.route.params.pipe(
      switchMap(
        (params: Params) => {
          return this.positionsService.fetch(params['id'])
        }
      ),
       map((positions: Position[]) => {
        return positions.map(positions => {
          positions.quantity = 1
          return positions
        })
       })


    )
  }
  addToOrder(position: Position) {
    MaterialService.toast(`Додано x${position.quantity}`)
    this.order.add(position)
  }
}
