import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

// Define the structure of your token payload
interface TokenPayload {
  username: string;
  email: string;
  _id: string;
  // Add any other fields you included in the token
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  data: {
    _id: string;
    username: string;
    email: string;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

@Injectable( {
  providedIn: 'root',
} )
export class AuthService {
  private isLoggedInSubject=new BehaviorSubject<boolean>( false );
  public isLoggedIn$=this.isLoggedInSubject.asObservable();

  private tokenKey='auth_token';
  private username='username';

  private _http=inject( HttpClient );
  private _environment=environment.baseUrl;

  constructor ( private router: Router ) {
    const token=this.getAuthToken();
    this.isLoggedInSubject.next( !!token );
  }

  getAuthToken(): string|null {
    return localStorage.getItem( this.tokenKey );
  }

  setLoginStatus( response: LoginResponse ): void {
    localStorage.setItem( this.tokenKey, response.token );
    try {
      const decoded: TokenPayload=jwtDecode( response.token );
      localStorage.setItem( this.username, decoded.username );
      this.isLoggedInSubject.next( true );
    } catch ( e ) {
      console.error( 'Error decoding token:', e );
    }
  }

  logout(): void {
    localStorage.removeItem( this.tokenKey );
    localStorage.removeItem( this.username );
    this.isLoggedInSubject.next( false );
    this.router.navigate( ['/login'] );
  }

  userRegister( reqObj: RegisterRequest ) {
    return this._http.post<RegisterResponse>( `${ this._environment }/api/register`, reqObj );
  }

  userlogin( reqObj: LoginRequest ) {
    return this._http.post<LoginResponse>( `${ this._environment }/api/login`, reqObj ).pipe(
      tap( response => this.setLoginStatus( response ) )
    );
  }

  // Google OAuth login (redirect, old)
  initiateGoogleLogin(): void {
    window.location.href=`${ this._environment }/api/auth/google`;
  }

  // Google OAuth login (popup, new)
  initiateGoogleLoginPopup(): void {
    const popup=window.open(
      `${ this._environment }/api/auth/google`,
      'GoogleLogin',
      'width=500,height=600'
    );

    if ( !popup ) {
      alert( 'Popup blocked! Please allow popups for this site.' );
      return;
    }

    // Listen for token from popup
    const listener=( event: MessageEvent ) => {
      // Only accept messages from our own origin
      if ( event.origin!==window.location.origin ) return;
      if ( event.data&&event.data.type==='google-auth-token' ) {
        this.setLoginStatus( {token: event.data.token, data: {_id: '', username: '', email: ''}} );
        this.router.navigate( ['/home'] );
        window.removeEventListener( 'message', listener );
        popup.close();
      }
    };
    window.addEventListener( 'message', listener );
  }

  // Check authentication status
  checkAuthStatus(): Observable<any> {
    return this._http.get<any>( `${ this._environment }/api/auth/status` );
  }
}
