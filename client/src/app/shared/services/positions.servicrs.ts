import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Message, Position} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PositionsServicrs {
  constructor(private http: HttpClient) {
  }
  fetch(categoryId: string): Observable<Position[]> {
     return  this.http.get<Position[]>(`http://localhost:5000/api/position/${categoryId}`)
  }
  create(position: Position): Observable<Position> {
    return this.http.post<Position>('http://localhost:5000/api/position', position)
  }
  updateById(position: Position): Observable<Position> {
    return this.http.patch<Position>(`http://localhost:5000/api/position/${position._id}`, position)
  }
  deleteById(position: Position): Observable<Message> {
    return this.http.delete<Message>(`http://localhost:5000/api/position/${position._id}`)
  }
}
