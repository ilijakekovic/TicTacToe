import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tic-tac-toe-client';
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateUsername();

    // Subscribe to router events to detect URL changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUsername();
    });
  }

  updateUsername(): void {
    this.username = localStorage.getItem('username') || '';
    console.log('Username:', this.username);
  }

  logout(): void {
    localStorage.removeItem('username');
    this.username = '';
    window.location.href = '/login';
  }
}
