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

  Passo a passo build Ionic Android Studio

1. Pré-requisitos Essenciais
Antes de começar, certifique-se de que você tem instalado:

Node.js e Ionic CLI.

Android Studio (com o Android SDK instalado).

Java JDK (geralmente vem com o Android Studio, mas o Java 11 ou 17 é recomendado).

2. Preparar o Projeto (Build Web)
Primeiro, precisamos transformar seu código (Angular, React ou Vue) em arquivos estáticos (HTML, CSS, JS) que o celular consiga ler.

Abra o terminal na raiz do seu projeto.

- Gere a build de produção:
  ionic build

3. Configurar o Ambiente Nativo (Capacitor)
Agora vamos dizer ao Ionic que queremos adicionar o Android como uma plataforma nativa.

- Instale o pacote Android (se ainda não tiver):
npm install @capacitor/android

- Adicione a plataforma Android ao projeto:
npx cap add android

- Sincronize o código web com o código nativo. Este passo é crucial. Sempre que você mudar seu HTML/CSS/JS, você deve rodar este comando antes de abrir o Android Studio:
npx cap sync

4. Preparar o Celular (Modo Desenvolvedor)
O Android bloqueia a instalação de apps via USB por padrão. Você precisa liberar isso.

.No celular, vá em Configurações > Sobre o telefone.
.Procure por Número da Versão (ou Build Number).
.Toque nele 7 vezes seguidas até aparecer a mensagem "Você agora é um desenvolvedor".
.Volte, vá em Sistema (ou Configurações Adicionais) > Opções do Desenvolvedor.
.Ative a opção Depuração USB (USB Debugging).

5. Rodar via Android Studio
Agora vamos passar o código para o Android Studio e instalar no celular.

- Conecte seu celular ao computador via cabo USB.

- No terminal do projeto, execute:
npx cap open android

No Android Studio:

- Aguarde o Gradle Sync terminar (pode demorar alguns minutos na primeira vez, veja a barra de progresso no canto inferior direito).
- Na barra superior, localize o menu de dispositivos. Seu celular deve aparecer lá (ex: "Samsung SM-G990").
- Clique no botão Play (triângulo verde) ou pressione Shift + F10.

