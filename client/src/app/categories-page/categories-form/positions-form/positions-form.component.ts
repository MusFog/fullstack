import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsServicrs} from "../../../shared/services/positions.servicrs";
import {Position} from "../../../shared/interfaces";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../../../shared/components/loader/loader.component";
import {MaterialInstance, MaterialService} from "../../../shared/classes/material.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {response} from "express";

@Component({
  selector: 'app-positions-form',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    LoaderComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './positions-form.component.html',
  styleUrl: './positions-form.component.css'
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef
  positions!: Position[]
  loading = false
  positionId = null
  modal!: MaterialInstance
  form!: FormGroup
  constructor(private positionsService: PositionsServicrs) {
  }
  ngOnInit() {
       this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
         // @ts-ignore
      cost: new FormControl(1, [Validators.required, Validators.min(1)])

    })
    this.loading = true
     this.positionsService.fetch(this.categoryId).subscribe(positions => {
       this.positions = positions
       this.loading = false
     })
  }
  ngOnDestroy() {
    // @ts-ignore
    this.modal.destroy()
  }

  ngAfterViewInit() {
     this.modal = MaterialService.initModal(this.modalRef)
  }
  onSelectPosition(position: Position) {
    // @ts-ignore
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    // @ts-ignore
    this.modal.open()
    MaterialService.updateTextInputs()
  }
  onAddPosition() {
    this.positionId = null
    this.form.reset({
      name: null,
      cost: null
    })
    // @ts-ignore
    this.modal.open()
    MaterialService.updateTextInputs()
  }
  onCancel() {
    // @ts-ignore
    this.modal.close()
  }

  onSubmit() {
    this.form.disable()
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const completed = () =>  {
      // @ts-ignore
      this.modal.close()
      this.form.reset({name: '', cost: ''})
      this.form.enable()
    }

    if (this.positionId) {
      newPosition._id = this.positionId
      this.positionsService.updateById(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position
          MaterialService.toast('Зміни було збережено')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиція створена')
          this.positions.push(position)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }

  }
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation()
    const decision = window.confirm(`Видалити позицію "${position.name}"?`)
    if (decision) {
      this.positionsService.deleteById(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}
