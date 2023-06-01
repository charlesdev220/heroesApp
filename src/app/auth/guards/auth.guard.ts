import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  private checkAuthStatus() : Observable<boolean>  {
    console.log(`AuthGuard`);
    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => console.log('Authenticated', isAuthenticated)),
        tap( isAuthenticated => {
          if( !isAuthenticated ) this.router.navigate(['./auth/login']);
        })
      )
  }

  //cambio lo que devuelve
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    //console.log(`can match`);
    //console.log({route, segments});
    return this.checkAuthStatus();
  }

  //cambio lo que devuelve
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    //console.log(`can activate`);
    //console.log({route, state});
    return this.checkAuthStatus();
  }


}
