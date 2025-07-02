import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../core/services/socket.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-single-chat',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './single-chat.component.html',
  styleUrl: './single-chat.component.scss',
})
export class SingleChatComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  combinedUsers: any[] = [];
  messages: any[] = [];
  selectedUser: any = null;
  messageContent: string = '';
  currentUser: string | null = null;
  unreadCounts: Map<string, number> = new Map(); // To track unread messages

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('username');

    // Subscribe to the reliable, stateful user list from the service
    this.socketService.getAllUsers().subscribe((users: any[]) => {
      if (users) {
        this.combinedUsers = users.filter(
          (user) => user.username !== this.currentUser
        );
        this.cdr.detectChanges();
      }
    });

    this.socketService.getChatHistory().subscribe((history: any) => {
      this.messages = history;
      this.cdr.detectChanges();
    });

    this.socketService.getPrivateMessage().subscribe((message: any) => {
      // Check if the message is part of the currently selected conversation
      if (
        this.selectedUser &&
        (message.from === this.selectedUser.username ||
          message.to === this.selectedUser.username)
      ) {
        this.messages.push(message);
        this.cdr.detectChanges();
      } else if (
        !this.selectedUser ||
        message.from !== this.selectedUser.username
      ) {
        // Handle unread count for messages from other chats
        const sender = message.from;
        const currentCount = this.unreadCounts.get(sender) || 0;
        this.unreadCounts.set(sender, currentCount + 1);
        this.cdr.detectChanges();
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  selectChat(user: any) {
    //if ( user.status!==1 ) {
    //  console.log( "Cannot chat with an offline user." );
    //  return;
    //}
    this.selectedUser = user;
    this.messages = []; // Clear messages immediately

    // Reset unread count for this user when their chat is opened
    this.unreadCounts.delete(user.username);

    // Request the history for the selected user
    this.socketService.requestChatHistory(this.selectedUser.username);

    if (window.innerWidth < 768) {
      this.closeSidebar();
    }
  }

  sendMessage(): void {
    if (
      this.messageContent.trim() &&
      this.selectedUser &&
      this.selectedUser.status === 1
    ) {
      this.socketService.sendPrivateMessage(
        this.selectedUser.username,
        this.messageContent
      );
      // The message will be added to the UI when it's received back from the server.
      this.messageContent = '';
    } else {
      console.log('Cannot send message, user is offline or no user selected.');
    }
  }

  ngOnDestroy(): void {
    // Cleanup code if needed
  }

  startAudioCall() {
    console.warn('Starting audio call with', this.selectedUser.username);
    // Your logic here
  }

  startVideoCall() {
    console.warn('Starting video call with', this.selectedUser.username);
    // Your logic here
  }
}
