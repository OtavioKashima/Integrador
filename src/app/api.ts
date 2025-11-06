// Caminho: src/app/api.ts

import { Injectable } from '@angular/core';
// 1. HttpClient é o único import necessário agora
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private apiUrl: string = 'https://esp32-mongodb-idev3.onrender.com';

  constructor(private Http: HttpClient) { }

  getSensores(): Observable<any[]> {
    // 2. Removemos os 'headers'

    // "CACHE BUSTER": Cria um parâmetro de tempo único
    const timestamp = new Date().getTime();

    // 3. Fazemos a chamada SEM os headers, mas MANTENDO o cache buster
    return this.Http.get<any[]>(
      `${this.apiUrl}/api/leituras/gA5kPz7RqL2mS8vBwT9E?_t=${timestamp}`
    );
  }

  getHistorico(data: string): Observable<any[]> {
    // 4. Removemos os 'headers' daqui também

    // "CACHE BUSTER"
    const timestamp = new Date().getTime();

    // 5. Fazemos a chamada SEM os headers, mas MANTENDO o cache buster
    return this.Http.get<any[]>(
      `${this.apiUrl}/api/historico-dia/gA5kPz7RqL2mS8vBwT9E?data=${data}&_t=${timestamp}`
    );
  }
}