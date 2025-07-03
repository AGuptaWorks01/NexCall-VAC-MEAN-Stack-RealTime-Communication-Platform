import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn=( route, state ) => {
  const authService=inject( AuthService );
  const router=inject( Router )

  const isLoggedIn=authService.getAuthToken()!==null;

  if ( !isLoggedIn ) {
    router.navigate( ['/login'] );
  }

  return isLoggedIn;
};

export const guestGuard: CanActivateFn=( route, state ) => {
  const authService=inject( AuthService );
  const router=inject( Router );

  const isLoggedIn=authService.getAuthToken()!==null;

  if ( isLoggedIn ) {
    router.navigate( ['/home'] );
    return false;
  }

  return true;
};
