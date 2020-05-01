import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyTokenService {

  public test: boolean;

  newTokenUrl = 'http://18.224.183.130:3000/newtoken';
  // newTokenUrl = ' http://localhost:3000/newtoken';
  checkTokenUrl = 'http://18.224.183.130:3000/checktoken';
  // checkTokenUrl = 'http://localhost:3000/checktoken';
  constructor(private theHttp: HttpClient) { }

  createToken() {
     return    this.theHttp.post<any>(this.newTokenUrl, null);

  }
  checkToken(token: string) {

    return this.theHttp.post<any>(this.checkTokenUrl, { message: '' + token });

  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}

