import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-selection.component.html',
  styleUrls: ['./room-selection.component.css']
})
export class RoomSelectionComponent implements OnInit {
  availableRooms: string[] = [];
  selectedRoom: string = '';
  
  constructor(private websocketService: WebsocketService, private router: Router) {}

  ngOnInit(): void {
    // Get available rooms when the component initializes
    this.websocketService.getAvailableRooms().subscribe(rooms => {
      this.availableRooms = rooms;
    });
  }

  joinRoom(room: string) {
    if (this.selectedRoom !== room) {
      this.selectedRoom = room;
      this.websocketService.joinGame(room);
      this.router.navigate(['/game', room]);
    }
  }
}
