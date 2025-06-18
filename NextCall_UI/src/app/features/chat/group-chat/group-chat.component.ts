import {Component, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SocketService} from '../../../core/services/socket.service';

@Component( {
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss']
} )
export class GroupChatComponent implements OnInit {
  isSidebarOpen: boolean=true; // For responsive sidebar
  groups: any[]=[];
  selectedGroup: any=null;
  messages: any[]=[];
  messageContent: string='';
  newGroupName: string='';
  currentUser: string|null=null;
  isAdmin: boolean=false; // To track admin status
  joinedGroupIds: Set<string>=new Set<string>(); // Track joined groups

  constructor ( private socketService: SocketService ) {}

  ngOnInit(): void {
    const storedUser=localStorage.getItem( 'user' ); // Assuming user object is stored as 'user'
    if ( storedUser ) {
      const user=JSON.parse( storedUser );
      this.currentUser=user.username;
      this.isAdmin=user.role==='admin';
      if ( this.currentUser ) {
        this.socketService.register( this.currentUser );
      }
    }

    this.socketService.getGroupList().subscribe( ( groups: any ) => {
      this.groups=groups;
    } );

    this.socketService.getGroupMessages().subscribe( ( message: any ) => {
      if ( this.selectedGroup&&message.groupId===this.selectedGroup.id ) {
        // If it's a system message about joining, update our joined status
        if ( message.type==='system'&&message.message.includes( 'joined the group' ) ) {
          this.joinedGroupIds.add( message.groupId );
        }
        this.messages.push( message );
      }
    } );
  }

  toggleSidebar(): void {
    this.isSidebarOpen=!this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen=false;
  }

  createGroup(): void {
    if ( this.newGroupName.trim() ) {
      this.socketService.createGroup( this.newGroupName );
      this.newGroupName='';
    }
  }

  joinGroup( group: any ): void {
    this.socketService.joinGroup( group.id );
    this.joinedGroupIds.add( group.id );
    this.selectGroup( group ); // Automatically select group after joining
  }

  leaveGroup( group: any ): void {
    this.socketService.leaveGroup( group.id );
    this.joinedGroupIds.delete( group.id );
    // If the user leaves the currently selected group, deselect it
    if ( this.selectedGroup&&this.selectedGroup.id===group.id ) {
      this.selectedGroup=null;
      this.messages=[];
    }
  }

  selectGroup( group: any ): void {
    // Only allow selecting the group if the user has joined it.
    if ( !this.joinedGroupIds.has( group.id ) ) {
      console.log( "You must join the group to see messages." );
      return; // Early exit
    }

    if ( this.selectedGroup&&this.selectedGroup.id!==group.id ) {
      // Switching groups doesn't require leaving/rejoining if already a member.
    }
    this.selectedGroup=group;
    this.messages=[]; // Clear messages from previous group

    if ( window.innerWidth<768 ) {
      this.closeSidebar();
    }
  }

  sendMessage(): void {
    if ( this.messageContent.trim()&&this.selectedGroup ) {
      this.socketService.sendGroupMessage( this.selectedGroup.id, this.messageContent );
      // The message will be added to the messages array via the socket listener to avoid duplication.
      this.messageContent='';
    }
  }

  deleteGroup( group: any ): void {
    if ( !this.isAdmin ) {
      console.error( "You are not authorized to delete this group." );
      return;
    }
    // Optional: Add a confirmation dialog before deleting
    if ( confirm( `Are you sure you want to delete the group "${ group.name }"?` ) ) {
      this.socketService.deleteGroup( group.id );
    }
  }
}
