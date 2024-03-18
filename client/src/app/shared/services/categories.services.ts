import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Category, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesServices {
  constructor(private http: HttpClient) {

  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:5000/api/category')
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`http://localhost:5000/api/category/${id}`)
  }

  create(name: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    return this.http.post<Category>('http://localhost:5000/api/category', fd)
  }

  updateById(id: string | undefined, name: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
      console.log(image)
    }
    fd.append('name', name)
    return this.http.patch<Category>(`http://localhost:5000/api/category/${id}`, fd)
  }

  deleteById(id: string): Observable<Message> {
    return this.http.delete<Message>(`http://localhost:5000/api/category/${id}`)
  }
}
