import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {inject, NgZone} from '@angular/core';

export const errorInterceptor: HttpInterceptorFn=( req, next ) => {
  const toastr=inject( ToastrService );
  const authService=inject( AuthService );
  const router=inject( Router );
  const ngZone=inject( NgZone );

  return next( req ).pipe(
    catchError( ( error: HttpErrorResponse ) => {
      ngZone.run( () => {
        if ( !navigator.onLine ) {
          toastr.error( 'No Internet Connection', 'Network Error' );
          console.log( 'No Internet Connection', 'Network Error' );
        } else {
          switch ( error.status ) {
            case 401:
              toastr.error( 'Session expired. Please login again.', 'Unauthorized' );
              authService.logout();
              router.navigate( ['/login'] );
              break;
            case 403:
              toastr.error( 'You do not have permission to perform this action.', 'Forbidden' );
              break;
            case 404:
              toastr.error( 'Requested resource not found.', 'Not Found' );
              break;
            case 500:
              toastr.error( 'Server error occurred. Please try again later.', 'Server Error' );
              break;
            default:
              toastr.error( error.message||'An unexpected error occurred', 'Error' );
              break;
          }
        }
      } );
      return throwError( () => error );
    } )
  );
};
