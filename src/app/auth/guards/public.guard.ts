import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {


  constructor(private authService: AuthService,
    private router: Router) { }

  private checkAuthStatus() : Observable<boolean>  {
      console.log(`publicGuard`);
      return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => console.log('Authenticated', isAuthenticated)),
        tap( isAuthenticated => {
          if( isAuthenticated ) this.router.navigate(['./']);
        }
        ),
        map( isAuthenticated => ! isAuthenticated)
      )
  }

  //cambio lo que devuelve
  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    //console.log(`can match2`);
    //console.log({route, segments});
    return this.checkAuthStatus();
  }

  //cambio lo que devuelve
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    //console.log(`can activate2`);
    //console.log({route, state});
    return this.checkAuthStatus();
  }


}

