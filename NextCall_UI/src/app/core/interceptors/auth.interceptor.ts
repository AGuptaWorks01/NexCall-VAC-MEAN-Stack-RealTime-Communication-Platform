import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn=( req, next ) => {
  const _authService=inject( AuthService );
  const token=_authService.getAuthToken();

  if ( token ) {
    const modifiedReq=req.clone( {
      setHeaders: {
        Authorization: `Bearer ${ token }`
      }
    } )

    return next( modifiedReq )
  }

  return next( req );
};
