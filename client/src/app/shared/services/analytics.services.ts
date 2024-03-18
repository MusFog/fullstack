import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AnalyticsPage, OverviewPage} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AnalyticsServices {
  constructor(private http: HttpClient) {
  }
  getOverview(): Observable<OverviewPage> {
    return this.http.get<OverviewPage>('http://localhost:5000/api/analytics/overview')
  }
  getAnalytics(): Observable<AnalyticsPage> {
    return this.http.get<AnalyticsPage>('http://localhost:5000/api/analytics/analytics')
  }
}
