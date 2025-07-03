import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {CommonModule} from '@angular/common';

@Component( {
    selector: 'app-auth-callback',
    imports: [CommonModule],
    template: `
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 animate-fade-in">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Confirm Google Login</h3>
        </div>
        <div class="px-6 py-6">
          <p class="text-gray-700 dark:text-gray-200 text-base">Are you sure you want to continue with this Google account?</p>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button type="button" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition" (click)="onCancel()">Cancel</button>
          <button type="button" class="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 transition" (click)="onContinue()">Continue</button>
        </div>
      </div>
    </div>
    <div *ngIf="!showModal" class="flex items-center justify-center min-h-screen">
      <span class="text-lg text-gray-700 dark:text-gray-200">Processing login...</span>
    </div>
    `
} )
export class AuthCallbackComponent implements OnInit {
    showModal=false;
    private token: string|null=null;

    constructor (
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private toastr: ToastrService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe( params => {
            const token=params['token'];
            const error=params['error'];

            if ( error ) {
                this.toastr.error( 'Authentication failed. Please try again.' );
                this.router.navigate( ['/login'] );
                return;
            }

            if ( token ) {
                // If opened in a popup, send token to opener
                if ( window.opener ) {
                    window.opener.postMessage( {type: 'google-auth-token', token}, window.location.origin );
                    window.close();
                } else {
                    this.token=token;
                    this.showModal=true;
                }
            } else {
                this.toastr.error( 'No authentication token received' );
                this.router.navigate( ['/login'] );
            }
        } );
    }

    onContinue() {
        if ( this.token ) {
            localStorage.setItem( 'auth_token', this.token );
            this.authService.setLoginStatus( {
                token: this.token,
                data: {
                    _id: '',
                    username: '',
                    email: ''
                }
            } );
            this.toastr.success( 'Login successful!' );
            this.router.navigate( ['/home'] );
        }
    }

    onCancel() {
        this.token=null;
        this.showModal=false;
        localStorage.removeItem( 'auth_token' );
        this.toastr.info( 'Login cancelled.' );
        this.router.navigate( ['/login'] );
    }
} 