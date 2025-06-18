import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component( {
    selector: 'app-auth-callback',
    template: '<div>Processing login...</div>'
} )
export class AuthCallbackComponent implements OnInit {
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
                // Store the token
                localStorage.setItem( 'auth_token', token );

                // Set login status
                this.authService.setLoginStatus( {
                    token,
                    data: {
                        _id: '',
                        username: '',
                        email: ''
                    }
                } );

                this.toastr.success( 'Login successful!' );
                this.router.navigate( ['/home'] );
            } else {
                this.toastr.error( 'No authentication token received' );
                this.router.navigate( ['/login'] );
            }
        } );
    }
} 