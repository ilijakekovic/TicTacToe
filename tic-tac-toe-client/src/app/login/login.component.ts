import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (username) {
      this.username = username;
      this.router.navigate(['/room-selection']);
    }
  }

  login() {
    if (this.username.trim()) {
      localStorage.setItem('username', this.username);
      this.router.navigate(['/room-selection']);
    } else {
      alert('Please enter a valid username.');
    }
  }
}
