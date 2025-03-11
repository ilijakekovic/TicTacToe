import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private serverUrl = 'http://localhost:5000'; // !!! Update this for production

  constructor() { 
    this.socket = io(this.serverUrl);
  }

  // Join a game room
  joinGame(gameId: string) {
    this.socket.emit('join', gameId);
  }

  // Listen for game state updates
  onGameState(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('gameState', (state) => {
        observer.next(state);
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
    this.socket.emit('makeMove', { room, index});
  }

  // Disconnect from the server
  disconnect() {
    this.socket.disconnect();
  }
}
