import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

interface RecaptchaResponse {
  success: boolean;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private headers: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json'
  );
  private url = 'https://www.google.com/recaptcha/api/siteverify';

  constructor(private _http: HttpClient) {}

 async executeRecaptcha(grecaptcha: any): Promise<string> {
    if (!grecaptcha) {
      throw new Error('reCAPTCHA no ha sido cargado');
    }

    try {
      const token = await grecaptcha.execute(environment.recaptcha.siteKey, {
        action: 'submit',
      });
      return token;
    } catch (error) {
      console.error('Error ejecutando reCAPTCHA:', error);
      throw error;
    }
  }

  verifyToken(token: string): Observable<any> {    
    let params = JSON.stringify({ secret: environment.recaptcha.siteSecret, response: token });
    
    return this._http.post<RecaptchaResponse>(this.url, params, {
      headers: this.headers,
    });        
  }
}
