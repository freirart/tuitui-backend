<h1 align="center">
	REST API - Controle Financeiro<br/>
	<a href="http://www.musicplayce.com" target="_blank">
		<img src="https://raw.githubusercontent.com/freirart/desafio-tecnico-music-playce/main/public/readme-caption-image.gif" width="400" />
	</a>
</h1>

TL;DR: <a href="https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md" id="docs" target="_blank"> API Documentation </a>

## Proposta
Desafio técnico proposto pela <a href="http://www.musicplayce.com" target="_blank">MusicPlayce</a> _- plataforma brasileira para publicação de músicas e composições inéditas fundada em 2018 -_ cuja proposta era desenvolver uma solução de controle financeiro que detivesse de um sistema de autorização baseado em _token_.

A aplicação consiste em uma __API REST__ desenvolvida em __NodeJS__ com __Typescript__. Utiliza-se do Banco Não Relacional __MongoDB__ e seu método de autorização é baseado no __JWT__ (_JSON Web Token_).

## Tecnologias

### Arquitetura da aplicação
* <a href="https://github.com/expressjs/express" target="_blank">ExpressJS</a>
* <a href="https://github.com/Automattic/mongoose" target="_blank">Mongoose</a>
* <a href="https://www.mongodb.com/" target="_blank">MongoDB</a>

### Segurança
* <a href="https://github.com/auth0/node-jsonwebtoken" target="_blank">JSON Web Token</a>
* <a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank">Bcrypt</a>

### Testes
* <a href="https://github.com/facebook/jest" target="_blank">Jest</a>
* <a href="https://github.com/visionmedia/supertest" target="_blank">Supertest</a>
* <a href="https://github.com/simonexmachina/factory-girl" target="_blank">Factory-girl</a>
* <a href="https://github.com/Marak/faker.js" target="_blank">Faker</a>

<h2 id="deploy"> Deploy </h2>

A aplicação está disponibilizada gratuitamente pela <a href="https://www.heroku.com">Heroku</a> no endereço: <br>

`https://desafio-tecnico-mp.herokuapp.com/`

Por ser uma hospedagem gratuita, passado um tempo sem receber requisições a aplicação entra em estado de _"hibernação"_, demorando mais que o comum para responder (_na __primeira__ requisição somente_). 

Certifique-se que a aplicação esteja _"acordada"_ antes de rodar testes ou consumir endpoints acessando o endereço acima. Você deverá receber um JSON contendo um erro informando que o endpoint em questão é inválido e o link para a documentação oficial da aplicação.

## Modo de usar
Para obter o código fonte da aplicação em sua máquina é necessário ter instalado o Node e um gerenciador de pacotes da sua preferência (_npm e yarn são os principais atualmente_).

Execute o seguinte comando em seu terminal para verificar se já os possui:

```
$ node -v
$ npm -v // OU yarn -v
```

Se uma mensagem de erro aparecer, o node e/ou o gerenciador de pacotes não está(ão) instalado(s). 

* <a href="https://nodejs.org/en/">Clique aqui</a> para baixar a última versão estável do Node (escolher a opção LTS, o npm vem junto).
* _(opcional)_ <a href="https://classic.yarnpkg.com/en/docs/install/#windows-stable">Clique aqui</a> para baixar o yarn.

Com o gerenciador de pacotes de sua preferência e o Node instalados, basta digitar os seguintes comandos no CLI do Git ou em seu terminal:

```
$ git clone https://github.com/freirart/desafio-tecnico-music-playce.git/
$ cd desafio-tecnico-music-playce/
$ npm install // OU yarn install
```

### Consumindo Endpoints
O consumo dos endpoins são baseados nas requições enviadas ao endereço onde a aplicação está disponibilizada: <br>

`https://desafio-tecnico-mp.herokuapp.com/`

> Executar localmente a aplicação com `npm start` ou `npm run dev` é impossível uma vez que se observa a inexistência de variáveis de ambiente que contêm informações sigilosas, tais como senhas de acesso ao banco de dados ou segredos de encriptação.

Clique <a href="https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md" id="docs" target="_blank">aqui</a> para descobrir os endpoints disponíveis!

### Testando a aplicação
Para testar a aplicação é necessário ter o MongoDB instalado em sua máquina.

Para verificar se o possui, rode o seguinte comando:

```
$ mongo --version
```

Caso não o possua, <a href="https://www.mongodb.com/try/download/community">clique neste link</a> para baixar a versão gratuita (_Community_).

Se estiver enfrentando problemas ao executar o comando `mongo --version` no Sistema Operacional Windows, verifique <a href="https://netovieiraleo.medium.com/instalando-e-configurando-o-mongodb-no-windows-b1d4e1e58911">este</a> tutorial! 

Com o Mongo instalado, execute o comando abaixo no diretorio raiz para rodar os testes:

```
$ npm test
```

Os testes duram, em média, 40 segundos.

> Certifique-se de que a aplicação não está _"hibernando"_ como foi mencionado na seção <a href="#deploy">Deploy</a>, caso contrário o teste falhará.

## Licença MIT
Direitos Reservados 2020 Artur Freire

Permissão é garantida por este meio, livre de ônus, para qualquer pessoa que obtenha uma cópia desde software e arquivos de documentação associados, para lidar com o Software sem restrições, incluindo nenhuma limitação de direitos de uso, cópia, modificação, fusão, publicação, distribuição, sublicenciamento, e/ou venda de cópias do Software, e para permitir que pessoas a quem foi fornecido o Software façam o mesmo, sujeitos às seguintes condições:

A nota de direitos reservados acima, e a nota de permissão devem ser incluídas em todas as cópias ou porções substanciais do Software.

O SOFTWARE É FORNECIDO “COMO É”, SEM QUALQUER TIPO DE GARANTIAS, EXPRESSA OU IMPLÍCITA, INCLUINDO PORÉM AS GARANTIAS DE COMERCIALIZAÇÃO, ADEQUADAS PARA UM DETERMINADO PROPÓSITO E NÃO VIOLAÇÃO. EM NENHUMA HIPÓTESE DEVERÃO OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SEREM RESPONSÁVEIS POR ALGUMA RECLAMAÇÃO, DANO OU OUTRA SUSCETIBILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTES, DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS AÇÕES DO SOFTWARE.
