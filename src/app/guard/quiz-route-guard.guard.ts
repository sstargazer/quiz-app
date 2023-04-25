import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class QuizRouteGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (!this.userService.userHasSelectedCategory) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
