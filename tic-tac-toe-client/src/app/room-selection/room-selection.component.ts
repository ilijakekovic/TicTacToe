import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';


@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-selection.component.html',
  styleUrl: './room-selection.component.css'
})
export class RoomSelectionComponent implements OnInit {
  availableRooms: string[] = [];
  selectedRoom: string = '';
  
  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    // Get available rooms when the component initializes
    this.websocketService.getAvailableRooms().subscribe(rooms => {
      this.availableRooms = rooms;
    });
  }

  joinRoom(room: string) {
    this.selectedRoom = room;
    this.websocketService.joinGame(room);
  }
}
