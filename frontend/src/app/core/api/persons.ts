import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatePersonDto, Person, UpdatePersonDto } from '../../shared/types/person.types';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Persons {
  private httpClient = inject(HttpClient);
  private baseURL = environment.apiUrl + '/persons/';

  getAll() {
    return this.httpClient.get<Person[]>(this.baseURL).pipe(
      catchError((error) => {
        console.error('Fehler beim Laden der Personen', error);
        return throwError(() => error);
      }),
    );
  }

  getOne(id: string) {
    return this.httpClient.get<Person>(this.baseURL + id).pipe(
      catchError((error) => {
        console.error('Fehler beim Laden der Person', error);
        return throwError(() => error);
      }),
    );
  }

  create(data: CreatePersonDto) {
    return this.httpClient.post<Person>(this.baseURL, data).pipe(
      catchError((error) => {
        console.error('Fehler beim Erstellen der Person', error);
        return throwError(() => error);
      }),
    );
  }

  update(id: string, data: UpdatePersonDto) {
    return this.httpClient.patch<Person>(this.baseURL + id, data).pipe(
      catchError((error) => {
        console.error('Fehler beim Updaten der Person', error);
        return throwError(() => error);
      }),
    );
  }

  delete(id: string) {
    return this.httpClient.delete<Person>(this.baseURL + id).pipe(
      catchError((error) => {
        console.error('Fehler beim Löschen der Person', error);
        return throwError(() => error);
      }),
    );
  }
}
