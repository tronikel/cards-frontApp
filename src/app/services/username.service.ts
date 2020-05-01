import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {
  public test: boolean;

  checkUsernameUrl = 'http://18.224.183.130:3000/checkusername';
  // checkUsernameUrl = 'http://localhost:3000/checkusername';
  constructor(private theHttp: HttpClient) { }


  checkUsername(username: string, token: string) {

    return this.theHttp.post<any>(this.checkUsernameUrl, { message: token + '-' + username});

  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
