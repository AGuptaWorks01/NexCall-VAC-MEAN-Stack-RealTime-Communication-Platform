import {CommonModule} from '@angular/common';
import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {ToastrService} from 'ngx-toastr';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';



@Component( {
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatToolbarModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
} )
export class HeaderComponent {
  dropdownOpen=false;
  sidebarOpen=false;
  username: string|null='';

  private router=inject( Router );
  private authService=inject( AuthService );
  private toastr=inject( ToastrService );

  // Profile Dropdown refs
  // @ViewChild( 'profileDropdown' ) profileDropdownRef!: ElementRef;
  // @ViewChild( 'profileButton' ) profileButtonRef!: ElementRef;
  // @ViewChild( 'sideDropdown' ) sideDropdown!: ElementRef;
  // @ViewChild( 'sideButton' ) sideButton!: ElementRef;

  // toggleSidebar() {
  //   this.sidebarOpen=!this.sidebarOpen;
  // }

  ngOnInit(): void {
    this.username=localStorage.getItem( 'username' );
  }

  // toggleDropdown() {
  //   this.dropdownOpen=!this.dropdownOpen;
  // }

  logout() {
    this.authService.logout();
    this.toastr.success( 'Logged out successfully' );
    this.router.navigateByUrl( 'login' );
  }

  // @HostListener( 'document:click', ['$event'] )
  // onDocumentClick( event: Event ) {
  //   const target=event.target as HTMLElement;

  //   // Close profile dropdown if click is outside of button and dropdown
  //   if ( this.profileDropdownRef&&this.profileButtonRef ) {
  //     const clickedInsideDropdown=this.profileDropdownRef.nativeElement.contains( target );
  //     const clickedButton=this.profileButtonRef.nativeElement.contains( target );

  //     if ( !clickedInsideDropdown&&!clickedButton ) {
  //       this.dropdownOpen=false;
  //       this.sidebarOpen= false
  //     }
  //   }
  // }
}
