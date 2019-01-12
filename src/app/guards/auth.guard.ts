import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import {} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService
      .isLoggedIn()
      .then((loggedIn) => {
        if (loggedIn) {
          return Promise.resolve(true);
        } else {
          this.router.navigate(['/login']);

          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
}
