import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.getCurrentSession().pipe(
      map(session => {
        if (session && session.role) {
          // Check if route requires specific role
          const requiredRole = route.data?.['role'];
          if (requiredRole && session.role !== requiredRole) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }),
      catchError(error => {
        console.error('Session check failed:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}