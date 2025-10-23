import { Component, OnInit } from '@angular/core';
import { Api } from '../api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {

  constructor(private apiService: Api) { }

  dados: any[] = [];// definir array vazio
  hdados: any[] = [];// definir array vazio

  ngOnInit() {
    this.carregarDados();
    this.historicoDia();
  }

  carregarDados(): any {
    this.apiService.getSensores().subscribe({
      next: (data: any[]) => { //<ngFor
        console.log(data);
        this.dados = data;
      }, error: (err) => {
        console.log(err);
      }
    }
    )
  }

  historicoDia(): any {
    this.apiService.getHistorico().subscribe({
      next: (data: any[]) => {
        console.log(data);
        this.hdados = data;
      }, error: (err) => {
        console.log(err);
      }
    }
    )
  }

}
