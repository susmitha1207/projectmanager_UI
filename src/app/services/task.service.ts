import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Task } from '../model/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl='http://localhost:9999/task';
  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  saveOrUpdate(task :Task): Observable<Object>{
    const url = `${this.apiUrl}/saveorupdate`;
    return this.http.post<Task>(url,task).pipe(
      tap(_ => console.log(`Create Task`)),
      catchError(this.handleError<Task>(`saveOrUpdate`))
    );

  }
  
  getTaskById(id: string):Observable<Task>{
    const url = `${this.apiUrl}/getTask/${id}`;
    return this.http.get<Task>(url).pipe(
      tap(_ => console.log(`fetched Task id=${id}`)),
      catchError(this.handleError<Task>(`getTaskById id=${id}`))
    );
  }
  getAllTasks(): Observable<any>{
    const url = `${this.apiUrl}/getAllTasks`;
    return this.http.get(url).pipe(
      tap(_ => console.log(`fetched Task list`)),
      catchError(this.handleError<Task>(`getAllTasks`))
    );
  }
  getAllParentTasks(): Observable<any>{
    const url = `${this.apiUrl}/getAllParentTasks`;
    return this.http.get(url).pipe(
      tap(_ => console.log(`fetched Parent Task list`)),
      catchError(this.handleError<Task>(`getAllParentTasks`))
    );
  }
  deleteTask(id:string){
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url).pipe(
      tap(_ =>console.log('delete Task')),
      catchError(this.handleError<Task>('delete Task'))
    );
  }
}
