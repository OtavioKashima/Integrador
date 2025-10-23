import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private apiUrl: string = 'https://esp32-mongodb-idev3.onrender.com';
  
  constructor(private Http:HttpClient) {}

  getSensores() :Observable<any[]> {
    return this.Http.get<any[]>(this.apiUrl + '/api/leituras/gA5kPz7RqL2mS8vBwT9E');
  }

  getHistorico(): Observable<any[]> {
    return this.Http.get<any[]>(this.apiUrl + '/api/historico-dia/gA5kPz7RqL2mS8vBwT9E?data={$data}');
  }

}
