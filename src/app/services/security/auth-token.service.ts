import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {
  private _token: string | null = null;
  
  constructor() { }

  
  getToken(): string | null {
    return this._token;
  }

  setToken(token: string | null) {
    this._token = token;
  }
}