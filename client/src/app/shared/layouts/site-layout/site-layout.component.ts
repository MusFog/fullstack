import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgForOf} from "@angular/common";
import {AuthServices} from "../../services/auth.services";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgForOf,
    RouterLinkActive
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css'
})
export class SiteLayoutComponent implements AfterViewInit {

  @ViewChild('floating') floatingRef!: ElementRef
  links = [

    {url: '/overview', name: 'Обзор'},
    {url: '/analytics', name: 'Аналитика'},
    {url: '/history', name: 'История'},
    {url: '/order', name: 'Добавить заказ'},
    {url: '/categories', name: 'Ассортимент'}
  ]

  constructor(private auth: AuthServices, private router: Router) {

  }
  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }

  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
