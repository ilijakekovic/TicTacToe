import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { RoomSelectionComponent } from './room-selection/room-selection.component';

export const routes: Routes = [
  { path: '', redirectTo: 'room-selection', pathMatch: 'full' },
  { path: 'room-selection', component: RoomSelectionComponent },
  { path: 'game', component: GameComponent }
];
