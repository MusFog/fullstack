import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Order} from "../interfaces";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class OrdersServices {
  constructor(private http: HttpClient) {
  }
  create(order: Order): Observable<Order> {
    return this.http.post<Order>('http://localhost:5000/api/order', order)
  }
  fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('http://localhost:5000/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
}
