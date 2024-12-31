// services/country.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { CountryApiResponse, Country } from '../../interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly API_URL = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de países y la transforma al formato requerido
   * Realiza el filtrado de países que tienen código telefónico
   */
  getCountries(): Observable<Country[]> {
    return this.http.get<CountryApiResponse[]>(this.API_URL).pipe(
      map(countries => this.transformCountries(countries)),
      catchError(error => {
        console.error('Error fetching countries:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  /**
   * Transforma la respuesta de la API al formato que necesitamos
   * Filtra y ordena los países por nombre
   */
  private transformCountries(countries: CountryApiResponse[]): Country[] {
    return countries
      .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
      .map(country => ({
        name: country.name.common,
        code: country.cca2,
        // Combina el código raíz con el primer sufijo (si existe)
        dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
        flag: country.flags.svg
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}