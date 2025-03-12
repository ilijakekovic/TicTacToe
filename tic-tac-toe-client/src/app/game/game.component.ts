import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  
  board: string[] = Array(9).fill(null);
  currentTurn: string = 'X';
  room: string = '';
  userCount: number = 0;

  constructor(private websocketService: WebsocketService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.room = this.route.snapshot.paramMap.get('room') || 'game1';
    this.websocketService.joinGame(this.room);
    
    // Listen for game state updates
    this.websocketService.onGameState().subscribe((state: any) => {
      this.board = state.board;
      this.currentTurn = state.turn;
    });

    // Listen for user count updates
    this.websocketService.onUserCount().subscribe((count: number) => {
      this.userCount = count;
    });
  }

  makeMove(index: number) {
    console.log(`Making move at index ${index}`);
    if (!this.board[index]) {
      this.websocketService.makeMove(this.room, index);
    }
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect();
  }
}
