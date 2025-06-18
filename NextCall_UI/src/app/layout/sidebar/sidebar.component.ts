import {CommonModule} from '@angular/common';
import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component( {
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
} )
export class SidebarComponent {
  dropdownOpen=false;
  sidebarOpen=false;
  username: string|null='';

  // Profile Dropdown refs
  @ViewChild( 'sideDropdown' ) sideDropdownRef!: ElementRef;
  @ViewChild( 'sideButton' ) sideButtonRef!: ElementRef;

  toggleSidebar() {
    this.sidebarOpen=!this.sidebarOpen;
  }

  ngOnInit(): void {}


  @HostListener( 'document:click', ['$event'] )
  onDocumentClick( event: Event ) {
    const target=event.target as HTMLElement;

    // Close profile dropdown if click is outside of button and dropdown
    if ( this.sideDropdownRef&&this.sideButtonRef ) {
      const clickedInsideDropdown=this.sideDropdownRef.nativeElement.contains( target );
      const clickedButton=this.sideButtonRef.nativeElement.contains( target );

      if ( !clickedInsideDropdown&&!clickedButton ) {
        // this.dropdownOpen=false;
        this.sidebarOpen=false
      }
    }
  }
}

