criamos o nosso page (npx ionic g page dashboard)
colocamos standalone false para que ele não carregue separadamente


Criamos um service (npx ionic g service api)

Adicionar o HttpClientModule no imports do app.module. ** Se o import estiver dando erro, o caminho correto é esse "@angular/common/http" **

configurar o dashboard

Mudar o ionic.config por conta do cors

criar um "proxy.config.json" no mesmo local que o ionic.config e colocar a proxy com 
