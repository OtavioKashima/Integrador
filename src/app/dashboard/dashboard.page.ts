import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  dados: any[] = [];    // Dados para o Card "Ao Vivo"
  hdados: any[] = [];   // Dados para a Lista "Histórico"
  
  dataSelecionada: string = new Date().toISOString();
  ultimaAtualizacao: string = '--:--:--';

  private readonly POLLING_INTERVAL_MS = 5000;
  private timeoutId: any = null;
  private isPollingActive: boolean = false;

  // Converte data BR ("23/10/2025, 16:08:03") para Timestamp numérico
  private parseDataBR(dataStr: string): number {
    try {
      if (!dataStr) return 0;
      // Se já for ISO
      if (dataStr.includes('-') && !dataStr.includes('/')) return new Date(dataStr).getTime();
      
      // Se for BR
      const partes = dataStr.split(', ');
      if (partes.length < 2) return 0;
      const pData = partes[0].split('/');
      const pHora = partes[1].split(':');
      
      return new Date(
        parseInt(pData[2]), parseInt(pData[1]) - 1, parseInt(pData[0]),
        parseInt(pHora[0]), parseInt(pHora[1]), parseInt(pHora[2] || '0')
      ).getTime();
    } catch (e) { return 0; }
  }

  ngOnInit() {
    // Define a data selecionada como HOJE (corrigindo fuso horário)
    const hoje = new Date();
    const offset = hoje.getTimezoneOffset() * 60000;
    this.dataSelecionada = new Date(hoje.getTime() - offset).toISOString();

    // Inicia o processo
    this.isPollingActive = true;
    this.startPolling();
  }

  startPolling() {
    if (!this.isPollingActive) return;

    this.apiService.getSensores()
      .pipe(finalize(() => {
          if (this.isPollingActive) {
            this.timeoutId = setTimeout(() => this.startPolling(), this.POLLING_INTERVAL_MS);
          }
      }))
      .subscribe({
        next: (data: any[]) => {
          this.ngZone.run(() => {
            if (!data || data.length === 0) return;

            // 1. ORDENA TUDO (Mais recente primeiro)
            const todosOrdenados = [...data].sort((a, b) => {
              return this.parseDataBR(b.timestamp) - this.parseDataBR(a.timestamp);
            });

            // 2. ATUALIZA AS DUAS VARIÁVEIS
            this.atualizarListas(todosOrdenados);

            // Atualiza relógio de debug
            const agora = new Date();
            this.ultimaAtualizacao = `${agora.getHours()}:${agora.getMinutes()}:${agora.getSeconds()}`;
            this.cdr.detectChanges();
          });
        },
        error: (err) => console.error('Erro polling', err)
      });
  }

  // --- NOVA FUNÇÃO CENTRALIZADA ---
  // Recebe os dados novos e distribui para 'dados' e 'hdados'
  atualizarListas(todosDados: any[]) {
    
    // A. Atualiza o card "Ao Vivo" (sempre o primeiro item da lista geral)
    this.dados = todosDados;

    // B. Atualiza a lista "Histórico" filtrando pela data que está no calendário
    const diaSelecionado = this.dataSelecionada.split('T')[0]; // ex: "2025-10-23"

    const historicoFiltrado = todosDados.filter(item => {
      const ms = this.parseDataBR(item.timestamp);
      if (ms === 0) return false;
      const diaItem = new Date(ms).toISOString().split('T')[0];
      return diaItem === diaSelecionado;
    });

    // Aqui está o segredo: Atualizamos o hdados AUTOMATICAMENTE
    this.hdados = historicoFiltrado;
    
    console.log(`Atualizado! Ao Vivo: ${this.dados[0].timestamp} | Lista Histórico: ${this.hdados.length} itens`);
  }

  // Quando o usuário muda o calendário
  onDataChange(event: any) {
    this.dataSelecionada = event.detail.value;
    
    // Reutilizamos os dados que já temos na memória em 'this.dados'
    // para não precisar ir na API de novo
    if (this.dados.length > 0) {
      this.atualizarListas(this.dados);
    } else {
      // Se ainda não tem dados (primeira carga), chama o polling ou busca manual
      this.buscarDadosManualmente();
    }
  }

  // Fallback caso precise buscar manualmente (ex: dia muito antigo fora da lista principal)
  buscarDadosManualmente() {
    const dia = this.dataSelecionada.split('T')[0];
    this.apiService.getHistorico(dia).subscribe(data => {
        // Ordena e joga no hdados
        const ordenados = [...data].sort((a, b) => this.parseDataBR(b.timestamp) - this.parseDataBR(a.timestamp));
        this.hdados = ordenados;
        this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.isPollingActive = false;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}