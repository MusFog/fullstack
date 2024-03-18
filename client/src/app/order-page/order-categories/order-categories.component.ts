import {Component, OnInit} from '@angular/core';
import {CategoriesServices} from "../../shared/services/categories.services";
import {Observable} from "rxjs";
import {Category} from "../../shared/interfaces";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-order-categories',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    AsyncPipe,
    NgForOf,
    RouterLink
  ],
  templateUrl: './order-categories.component.html',
  styleUrl: './order-categories.component.css'
})

export class OrderCategoriesComponent implements OnInit{

  categories$!: Observable<Category[]>
  constructor(private categoriesService: CategoriesServices) {
  }
  ngOnInit() {

    this.categories$ = this.categoriesService.fetch()
  }
}
