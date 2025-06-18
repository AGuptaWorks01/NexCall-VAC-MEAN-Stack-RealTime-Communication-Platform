import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class SocketService {

  // Create a private BehaviorSubject to hold the latest user list
  private allUsersSubject=new BehaviorSubject<any[]>( [] );

  constructor ( private socket: Socket ) {
    // Listen for the raw socket event and update the BehaviorSubject
    this.socket.fromEvent( 'allUserList' ).subscribe( ( users: any ) => {
      
      this.allUsersSubject.next( users );
    } );
  }

  // Expose a public observable for components to subscribe to.
  // This will give them the latest list immediately upon subscription.
  getAllUsers(): Observable<any[]> {
    return this.allUsersSubject.asObservable();
  }

  // Method to register a user
  register( username: string ) {
    this.socket.emit( 'register', username );
  }

  // Method to send a private message
  sendPrivateMessage( toUsername: string, message: string ) {
    this.socket.emit( 'private message', {toUsername, message} );
  }

  // Listen for the list of users
  getUserList(): Observable<any> {
    return this.socket.fromEvent( 'userList' );
  }

  // Listen for incoming private messages
  getPrivateMessage(): Observable<any> {
    return this.socket.fromEvent( 'private message' );
  }

  // Listen for the full list of all users
  getAllUsersList(): Observable<any> {
    return this.socket.fromEvent( 'allUserList' );
  }

  // GROUP CHAT METHODS
  createGroup( groupName: string ) {
    this.socket.emit( 'create group', groupName );
  }

  joinGroup( groupId: string ) {
    this.socket.emit( 'join group', groupId );
  }

  leaveGroup( groupId: string ) {
    this.socket.emit( 'leave group', groupId );
  }

  sendGroupMessage( groupId: string, message: string ) {
    this.socket.emit( 'group message', {groupId, message} );
  }

  getGroupList(): Observable<any> {
    return this.socket.fromEvent( 'groupList' );
  }

  getGroupMessages(): Observable<any> {
    return this.socket.fromEvent( 'group message' );
  }

  deleteGroup( groupId: string ) {
    this.socket.emit( 'delete group', groupId );
  }

  // CHAT HISTORY METHODS
  requestChatHistory( otherUsername: string ) {
    this.socket.emit( 'get chat history', {otherUsername} );
  }

  getChatHistory(): Observable<any> {
    return this.socket.fromEvent( 'chat history' );
  }

  // Disconnect the socket
  disconnect() {
    this.socket.disconnect();
  }
}
