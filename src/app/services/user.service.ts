import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl='http://localhost:9999/user';
  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  saveOrUpdate(user :User): Observable<Object>{
    const url = `${this.apiUrl}/saveorupdate`;
    return this.http.post<User>(url,user).pipe(
      tap(_ => console.log(`Create User`)),
      catchError(this.handleError<User>(`saveOrUpdate`))
    );

  }
  
  getUserById(id: string):Observable<User>{
    const url = `${this.apiUrl}/getUser`;
    return this.http.get<User>(url).pipe(
      tap(_ => console.log(`fetched user id=${id}`)),
      catchError(this.handleError<User>(`getUserById id=${id}`))
    );
  }

  getAllUsers(): Observable<any>{
    const url = `${this.apiUrl}/getAllUsers`;
    return this.http.get(url).pipe(
      tap(_ => console.log(`fetched users list`)),
      catchError(this.handleError<User>(`getAllUsers`))
    );
  }
  deleteUser(id:string){
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url).pipe(
      tap(_ =>console.log('delete user')),
      catchError(this.handleError<User>('delete user'))
    );
  }
}
