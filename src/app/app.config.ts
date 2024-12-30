import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// path strategy
import { PathLocationStrategy, LocationStrategy } from '@angular/common';

// routes & interceptors
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestsInterceptor } from './interceptors/requests.interceptor';
import { errorsInterceptor } from './interceptors/errors.interceptor';

// primeNg configuration
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import MyPreset from '../preset';




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([requestsInterceptor, errorsInterceptor])),
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: MyPreset
        },
        ripple: true
    })
  ]
};
