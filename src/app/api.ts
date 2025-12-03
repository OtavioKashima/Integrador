import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Api {

  // Sua URL base
  private apiUrl: string = 'https://esp32-mongodb-idev3.onrender.com';
  
  constructor(private Http: HttpClient) {}

  // FUNÇÃO 1: PEGAR DADOS (Com Cache Buster)
  getSensores(): Observable<any[]> {
    // Cria um número único (ex: 1762455508812)
    const timestamp = new Date().getTime();

    // Adicionamos '?_t=' + timestamp na URL
    // O servidor ignora isso, mas o navegador acha que é uma página nova e baixa tudo de novo.
    return this.Http.get<any[]>(
      `${this.apiUrl}/api/leituras/n22cr968d42tau?_t=${timestamp}`
    );
  }

  // FUNÇÃO 2: PEGAR HISTÓRICO (Com Cache Buster)
  getHistorico(data: string): Observable<any[]> {
    const timestamp = new Date().getTime();

    return this.Http.get<any[]>(
      `${this.apiUrl}/api/historico-dia/n22cr968d42tau?data=${data}&_t=${timestamp}`
    );
  }
}