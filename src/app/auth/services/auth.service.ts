import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, of, tap, catchError, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {


  private baseUrl = environment.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  get currentUser(): User | undefined {
    if(!this.user) return undefined;
    return structuredClone(this.user);//crea un clon del objeto
  }

  login(email:string , password: string): Observable<User>{

    return this.http.get<User>(`${this.baseUrl}/users/1`)
      .pipe(
        tap(user => this.user = user),
        tap(user =>localStorage.setItem('token', user.id.toString())),
      );

  }

  //para los guards
  checkAuthentication(): Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap(user => this.user = user),
      map(user => !!user),//asegurandome que es un boolean
      catchError( err => of(false))
    )
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
