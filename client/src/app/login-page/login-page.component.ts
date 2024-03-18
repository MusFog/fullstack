import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthServices} from "../shared/services/auth.services";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription
  constructor(private auth: AuthServices, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Реєстрацію успішно виконано')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Будь-ласка увійдіть в сиситему знову')
      }
    })
  }
  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onsubmit() {
    this.form.disable()
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),

      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
