import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private apiUrl: string = '/api/leitura';
  
  constructor(private Http:HttpClient) {}

  getSensores() :Observable<any[]> {
    return this.Http.get<any[]>(this.apiUrl);
  }

}
