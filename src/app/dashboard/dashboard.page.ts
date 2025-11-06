// Caminho: src/app/dashboard/dashboard.page.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Api } from '../api';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {

  constructor(
    private apiService: Api,
    private cdr: ChangeDetectorRef
  ) { }

  // Voltamos a ter o 'dados' (eu tinha errado antes, desculpe)
  dados: any[] = [];
  hdados: any[] = [];
  private readonly POLLING_INTERVAL_MS = 5000;
  private timeoutId: any = null;
  private isPollingActive: boolean = false;

  ngOnInit() {
    const dataDeHoje = new Date().toISOString();
    this.buscarDadosDoDia(dataDeHoje);
    this.isPollingActive = true;
    this.startPolling();
  }

  startPolling() {
    if (!this.isPollingActive) {
      return;
    }

    this.apiService.getSensores()
      .pipe(
        finalize(() => {
          if (this.isPollingActive) {
            this.timeoutId = setTimeout(() => {
              this.startPolling();
            }, this.POLLING_INTERVAL_MS);
          }
        })
      )
      .subscribe({
        next: (data: any[]) => {
          if (!data || data.length === 0) {
            this.dados = [];
            this.cdr.detectChanges();
            return;
          }

          // --- INÍCIO DA SOLUÇÃO (ORDENAÇÃO) ---

          // 1. Criamos uma cópia do array e o ordenamos
          // Esta é a parte que garante que o mais novo fique no topo
          const dadosOrdenados = [...data].sort((a, b) => {
            try {
              // Converte os timestamps em números para comparação
              const timeA = new Date(a.timestamp).getTime();
              const timeB = new Date(b.timestamp).getTime();

              // Se algum timestamp for inválido, não mexe
              if (isNaN(timeA) || isNaN(timeB)) {
                return 0;
              }

              // b - a = Ordem Decrescente (Mais novo primeiro)
              return timeB - timeA;

            } catch (e) {
              return 0; // Em caso de erro, não mexe
            }
          });

          // --- FIM DA SOLUÇÃO ---

          console.log('Dados ordenados. Item no topo:', dadosOrdenados[0]);

          this.dados = dadosOrdenados;

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro no polling (live), mas vamos tentar de novo...', err);
        }
      });
  }

  ngOnDestroy() {
    console.log('Saindo da página, parando o polling.');
    this.isPollingActive = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  // 2. FUNÇÃO ACIONADA PELO CALENDÁRIO
  onDataChange(event: any) {
    const dataISO = event.detail.value;
    this.buscarDadosDoDia(dataISO);
  }

  // 3. FUNÇÃO DE BUSCA DO HISTÓRICO
  buscarDadosDoDia(dataISO: string): any {
    const dataFormatada = dataISO.split('T')[0];
    console.log('Buscando dados (Histórico) para:', dataFormatada);
    this.hdados = [];
    this.apiService.getHistorico(dataFormatada).subscribe({
      next: (data: any[]) => {
        console.log('Dados (Histórico) recebidos:', data);

        // APLICAMOS A MESMA LÓGICA AO HISTÓRICO
        // (Assim o item das 23:00 aparece antes do item das 08:00)
        const historicoOrdenado = [...data].sort((a, b) => {
          try {
            const timeA = new Date(a.timestamp).getTime();
            const timeB = new Date(b.timestamp).getTime();
            if (isNaN(timeA) || isNaN(timeB)) return 0;
            return timeB - timeA; // Mais novo primeiro
          } catch (e) {
            return 0;
          }
        });

        this.hdados = historicoOrdenado;
        this.cdr.detectChanges();
      }, error: (err) => {
        console.log(err);
        if (err.status === 404) {
          console.log('Nenhum dado encontrado para este dia.');
        }
      }
    }
    )
  }
}