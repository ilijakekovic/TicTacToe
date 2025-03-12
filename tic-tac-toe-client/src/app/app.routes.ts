import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomSelectionComponent } from './room-selection/room-selection.component';
import { RoomCreationComponent } from './room-creation/room-creation.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'room-selection', component: RoomSelectionComponent },
  { path: 'room-creation', component: RoomCreationComponent },
  { path: 'game/:room', component: GameComponent }
];
