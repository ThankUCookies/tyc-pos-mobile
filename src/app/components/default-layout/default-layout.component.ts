import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  private isLoggedIn: boolean;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.onAuthStatusChange().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  public onBtnLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
