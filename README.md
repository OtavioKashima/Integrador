criamos o nosso page (npx ionic g page dashboard)
colocamos standalone false para que ele não carregue separadamente


Criamos um service (npx ionic g service api)

Adicionar o HttpClientModule no imports do app.module. ** Se o import estiver dando erro, o caminho correto é esse "@angular/common/http" **


Service:
export class Api {

  private apiUrl: string = 'https://esp32-mongodb-idev3.onrender.com'; // <- Url do banco não relacional
  
  constructor(private Http:HttpClient) {}

  getSensores() :Observable<any[]> {
    return this.Http.get<any[]>(this.apiUrl + '/api/leituras/gA5kPz7RqL2mS8vBwT9E'); // <- Url contatenado com a rota de leitura
  }

}


configurar o dashboard, fazer com que ele puxe da api com o service:

dados: any[] = [];// <- definir como array vazio para não dar erro

    carregarDados(): any {
    this.apiService.getSensores().subscribe({ // <- getSensores no service lugar da onde tira as informações da api
      next: (data: any[]) => { //<ngFor
        console.log(data);
        this.dados = data;
      }, error: (err) => {
        console.log(err);
      }
    }
    )
  }


dashboard.html
...

<div *ngFor="let i of dados">// <-this.dados do next
      <p>Temperatura: {{i["temperatura"]}}</p>
      <p>Umidade: {{i["umidade"]}}</p>
      <p>Registro: {{i["timestamp"]}}</p>
  </div>

...

chama as funções:

ngOnInit() {
    this.carregarDados(); // <-função criada
  }
