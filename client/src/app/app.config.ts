import {ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient, withFetch,
  withInterceptorsFromDi
} from "@angular/common/http";
import {TokenInterceptor} from "./shared/classes/token.interceptor";


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
};

