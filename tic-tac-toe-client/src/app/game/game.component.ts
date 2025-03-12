import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  
  board: string[] = Array(9).fill(null);
  currentTurn: string = 'X';
  room: string = '';
  userCount: number = 0;
  playerSymbol: string = '';
  gameResult: string = '';
  chatMessages: { sender: string, message: string, timeStamp: string }[] = [];
  newMessage: string = '';
  username: string = '';

  constructor(private websocketService: WebsocketService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    if (!this.username) {
      alert('Username not found. Redirecting to login.');
      window.location.href = '/login';
      return;
    }

    this.room = this.route.snapshot.paramMap.get('room') || 'game1';
    this.websocketService.joinGame(this.room);
    
    // Listen for game state updates
    this.websocketService.onGameState().subscribe((state: any) => {
      this.board = state.board;
      this.currentTurn = state.turn;
      const socketId = this.websocketService.socket?.id;
      if (socketId) {
        this.playerSymbol = state.playerSymbols[socketId];
      }
    });

    // Listen for user count updates
    this.websocketService.onUserCount().subscribe((count: number) => {
      this.userCount = count;
    });

    // Listen for game result updates
    this.websocketService.onGameResult().subscribe((result: any) => {
      if (result.winner === this.playerSymbol) {
        this.gameResult = 'You win!';
      } else {
        this.gameResult = 'You lose!';
      }
    });

    // Listen for chat messages
    this.websocketService.listenForMessages().subscribe((message) => {
      this.chatMessages.push(message);
    });
  }

  makeMove(index: number) {
    console.log(`Making move at index ${index}`);
    if (!this.board[index] && this.currentTurn === this.playerSymbol) {
      this.websocketService.makeMove(this.room, index);
    }
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.websocketService.sendMessage(this.room, this.newMessage, this.username);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
