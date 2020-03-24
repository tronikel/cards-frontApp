
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IEmployee } from '../interfaces/employee';
import { Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';



@Injectable()
export class EmployeeService {

  private url: string = '/assets/data/employees.json';
  public employees: IEmployee[] = [];
  employeesSubject = new Subject<IEmployee[]>();
  constructor(private http: HttpClient) { }

  initEmployees(): Observable<IEmployee[]> {
    return this.http.get<IEmployee[]>(this.url)
      .pipe(tap(data => this.employees = data), catchError(this.errorHandler));
  }

  emitCurrentPlayer() {
    this.employeesSubject.next(this.employees);
  }

  errorHandler(error: HttpErrorResponse) {
    return observableThrowError(error.message || 'Server Error');
  }
  addEmployees() {
    this.employees.push({ 'id': this.employees.length+1, 'name': 'lionel', 'age': 10 });

    this.emitCurrentPlayer();
  }
}
