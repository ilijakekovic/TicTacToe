import { Component } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-creation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './room-creation.component.html',
  styleUrl: './room-creation.component.css'
})
export class RoomCreationComponent {
  roomName: string = '';
  errorMessage: string = '';

  constructor(private websocketService: WebsocketService, private router: Router) {}

  createRoom() {
    if (this.roomName.trim()) {
      this.websocketService.createRoom(this.roomName).subscribe({
        next: (room) => {
          // If room is created successfully, redirect to the game
          this.router.navigate(['/game', room]);
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid room name.';
    }
  }
}
