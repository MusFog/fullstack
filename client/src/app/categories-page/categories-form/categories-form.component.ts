import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PositionsFormComponent} from "./positions-form/positions-form.component";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {CategoriesServices} from "../../shared/services/categories.services";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [
    PositionsFormComponent,
    RouterLink,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.css'
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef
  form!: FormGroup
  image!: File
  imagePreview: string | ArrayBuffer | null | undefined = '';
  isNew = true
  category!: Category
  constructor(private route: ActivatedRoute, private categoriesService: CategoriesServices, private router: Router ) {
  }
  ngOnInit() {

    this.form = new FormGroup({

      name: new FormControl(null, Validators.required)
     })
      this.form.disable()
      this.route.params
        .pipe(
          switchMap(
            (params: Params) => {
              if (params['id']) {
                this.isNew = false
                return this.categoriesService.getById(params['id'])
              }
              return of(null)
            }
          )
        )
        .subscribe(
          (category: Category | null) => {
            if (category) {
              this.category = category
              this.form.patchValue({
                name: category.name
              })
              this.imagePreview = category.imageSrc
              MaterialService.updateTextInputs()
            }
            this.form.enable()
          },
          error => MaterialService.toast(error.error.message)
        )

  }
  triggerClick() {
    this.inputRef.nativeElement.click()
  }
  deleteCategory() {
    const decision = window.confirm(`Ви впевнені, що хочете видалити цю категорію? "${this.category.name}"`)
    if (decision) {
      if (this.category._id != null) {
        this.categoriesService.deleteById(this.category._id).subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
      }
    }
  }
  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file

    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }
  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
       obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.updateById(this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Зміни збережено')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
