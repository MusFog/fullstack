import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CategoriesServices} from "../shared/services/categories.services";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {Category} from "../shared/interfaces";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";


@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    RouterLink,
    LoaderComponent,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit {

  categories$!: Observable<Category[]>
  constructor(private categoriesService: CategoriesServices) {
  }
  ngOnInit() {
     this.categories$ = this.categoriesService.fetch()
  }

}
