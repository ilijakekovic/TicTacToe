import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy{
  
  board: string[] = Array(9).fill(null);
  currentTurn: string = 'X';
  room: string = 'game1'; //Room ID (can be dynamic)

  constructor(private websocketService: WebsocketService) {}

  makeMove(index: number) {
    if (!this.board[index] && this.currentTurn === 'X') {
      this.websocketService.makeMove(this.room, index);
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
  ngOnInit(): void {
    this.websocketService.joinGame(this.room);
    
    // Listen for game state updates
    this.websocketService.onGameState().subscribe((state: any) => {
      this.board = state.board;
      this.currentTurn = state.currentTurn;
    });  }
}
