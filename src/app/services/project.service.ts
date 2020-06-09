import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Project } from '../model/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl='http://localhost:9999/project';
  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  saveOrUpdate(project :Project): Observable<Object>{
    const url = `${this.apiUrl}/saveorupdate`;
    return this.http.post<Project>(url,project).pipe(
      tap(_ => console.log(`Create Project`)),
      catchError(this.handleError<Project>(`saveOrUpdate`))
    );

  }
  
  getProjectById(id: string):Observable<Project>{
    const url = `${this.apiUrl}/getProject`;
    return this.http.get<Project>(url).pipe(
      tap(_ => console.log(`fetched project id=${id}`)),
      catchError(this.handleError<Project>(`getProjectById id=${id}`))
    );
  }
  getAllProjects(): Observable<any>{
    const url = `${this.apiUrl}/getAllProjects`;
    return this.http.get(url).pipe(
      tap(_ => console.log(`fetched project list`)),
      catchError(this.handleError<Project>(`getAllProjects`))
    );
  }
  deleteProject(id:string){
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete(url).pipe(
      tap(_ =>console.log('delete project')),
      catchError(this.handleError<Project>('delete project'))
    );
  }

}
