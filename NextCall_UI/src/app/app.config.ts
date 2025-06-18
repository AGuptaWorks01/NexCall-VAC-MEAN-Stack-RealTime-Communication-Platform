import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr} from 'ngx-toastr';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {errorInterceptor} from './core/interceptors/error.interceptor';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

const config: SocketIoConfig={url: 'http://localhost:3000', options: {}};

export const appConfig: ApplicationConfig={
  providers: [
    importProvidersFrom( SocketIoModule.forRoot( config ) ),
    provideHttpClient( withInterceptors( [authInterceptor, errorInterceptor] ) ),
    provideZoneChangeDetection( {eventCoalescing: true} ),
    provideRouter( routes ),
    provideAnimations(),
    provideToastr( {
      positionClass: 'toast-top-right',
      timeOut: 500,          // Toast visible for 1 second
      extendedTimeOut: 0,     // No extra time on hover
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,     // Optional: click to dismiss
      disableTimeOut: false   // Ensure timeout is not disabled
    } )
  ]
};
