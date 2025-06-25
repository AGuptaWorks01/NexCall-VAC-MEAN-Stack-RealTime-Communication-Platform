import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../layout/header/header.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { SocketService } from '../../../core/services/socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div
      class="flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900 text-black dark:text-white"
    >
      <app-header></app-header>

      <div
        class="flex flex-1 min-h-0 bg-white dark:bg-gray-900 text-black dark:text-white"
      >
        <!-- Sidebar -->
        <div>
          <app-sidebar></app-sidebar>
        </div>

        <!-- Main Content -->
        <main class="flex-1 p-2 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    const currentUser = localStorage.getItem('username');
    if (currentUser) {
      this.socketService.register(currentUser);
    }
  }
}
