import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component( {
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
} )
export class LoginComponent implements OnInit {
  private fb=inject( FormBuilder );
  private router=inject( Router );
  private authService=inject( AuthService )
  private toastr=inject( ToastrService )

  showPassword: boolean=false
  userForm!: FormGroup

  constructor () {
    this.userForm=this.fb.group( {
      email: ['', Validators.compose( [Validators.required, Validators.email] )],
      password: ['', Validators.required],
    } );
  }

  ngOnInit(): void {
    // Check if user is redirected from Google OAuth
    this.authService.checkAuthStatus().subscribe( {
      next: ( response ) => {
        if ( response.isAuthenticated ) {
          this.toastr.success( 'Login Success' );
          setTimeout( () => {
            this.router.navigateByUrl( 'home' );
          }, 1000 );
        }
      }
    } );
  }

  login() {
    if ( this.userForm.invalid ) {
      this.toastr.warning( 'Please enter valid email and password' );
      return;
    }

    this.authService.userlogin( this.userForm.value ).subscribe( {
      next: ( res: any ) => {
        console.log("____________________",res);
        this.toastr.success( "Login Success", )
        // this.authService.setLoginStatus(res)
        setTimeout( () => {
          this.router.navigateByUrl( 'home' )
        }, 1000 );
      },
      error: ( err ) => {
        const backendMessage=err.error?.message;

        if ( backendMessage==='Invalid credentials'||backendMessage==='Wrong email or password' ) {
          this.toastr.error( 'Email or password is incorrect.' );
        } else if ( backendMessage ) {
          this.toastr.error( backendMessage );
        } else {
          this.toastr.error( 'An unexpected error occurred. Please try again.' );
        }
      }
    } )
  }

  loginWithGoogle() {
    this.authService.initiateGoogleLogin();
  }
}
