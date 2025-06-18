import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from '../../../layout/header/header.component';
import {SidebarComponent} from '../../../layout/sidebar/sidebar.component';
import {SocketService} from '../../../core/services/socket.service';
import {CommonModule} from '@angular/common';

@Component( {
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
} )
export class HomeComponent implements OnInit {

  constructor ( private socketService: SocketService ) {}

  ngOnInit(): void {
    const currentUser=localStorage.getItem( 'username' );
    if ( currentUser ) {
      this.socketService.register( currentUser );
    }
  }
}
