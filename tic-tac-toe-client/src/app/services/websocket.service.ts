import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket: Socket;
  private serverUrl = 'http://localhost:5000'; // !!! Update this for production

  constructor() { 
    this.socket = io(this.serverUrl);
  }

  // Join a game room
  joinGame(room: string) {
    this.socket.emit('joinGame', room);
  }

  // Listen for game state updates
  onGameState(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('gameState', (state) => {
        observer.next(state);
      });
    });
  }

  // Listen for game result updates
  onGameResult(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('gameResult', (result) => {
        observer.next(result);
      });
    });
  }

  // Get available rooms
  getAvailableRooms(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.emit('getAvailableRooms');
      this.socket.on('availableRooms', (rooms: string[]) => {
        observer.next(rooms);
      });
    });
  }

  // Make a move
  makeMove(room: string, index: number) {
    console.log(`Service - Sending makeMove event for room ${room} at index ${index}`);
    this.socket.emit('makeMove', { room, index });
  }

  // Disconnect from the server
  disconnect() {
    this.socket.disconnect();
  }

  // Create a room
  createRoom(roomName: string): Observable<string> {
    return new Observable(observer => {
      this.socket.emit('createRoom', roomName);

      // Listen for room creation response
      this.socket.on('roomCreated', (room: string) => {
        observer.next(room);
      });

      // Listen for room existence error
      this.socket.on('roomExists', (room: string) => {
        observer.error(`Room "${room}" already exists.`);
      });
    });
  }

  // Listen for user count updates
  onUserCount(): Observable<number> {
    return new Observable(observer => {
      this.socket.on('userCount', (count: number) => {
        observer.next(count);
      });
    });
  }

  // Send a chat message
  sendMessage(room: string, message: string, sender: string) {
    this.socket.emit('sendMessage', { room, message, sender });
  }

  // Listen for chat messages
  listenForMessages(): Observable<{ sender: string, message: string, timeStamp: string }> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (chatMessage) => {
        observer.next(chatMessage);
      });
    });
  }
}
