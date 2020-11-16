<h1 align="center">
	REST API - Controle Financeiro<br/>
	<a href="http://www.musicplayce.com" target="_blank">
		<img src="https://raw.githubusercontent.com/freirart/desafio-tecnico-music-playce/main/public/readme-caption-image.gif" width="400" />
	</a>
</h1>

TL;DR: <a href="https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md" target="_blank"> API Documentation </a>

## Proposta
Desafio técnico proposto pela <a href="http://www.musicplayce.com" target="_blank">MusicPlayce</a> _- plataforma brasileira para publicação de músicas e composições inéditas fundada em 2018 -_ cuja proposta era construir uma API REST de controle financeiro que detivesse de um sistema de autorização baseado em _token_.

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

## Deploy

A aplicação está disponibilizada numa __instância EC2__ da __AWS__ pelo endereço: <br>

`http://localhost:8080/`

## Modo de usar
Para obter o código fonte da aplicação em sua máquina, basta digitar os seguintes comandos no CLI do Git:

```
$ git clone https://www.github.com/freirart/desafio-tecnico-music-playce
$ cd desafio-tecnico-music-playce/
$ npm install // OU yarn install
```

### Testando a aplicação
Para testar a aplicação é necessário ter o MongoDB instalado em sua máquina.

Para verificar se o possui, execute o seguinte comando:

```
$ mongo --version
```

Com o Mongo instalado, rode o comando abaixo para rodar os testes

```
$ npm test
```
### Consumindo Endpoints
Para consumir os endpoints basta fazer as requições para o endereço onde a aplicação está disponibilizada: <br>

`http://localhost:8080/`

* <a href="https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md" target="_blank"> Documentação </a>

> Executar localmente a aplicação com `npm start` ou `npm run dev` é impossível uma vez que se observa a inexistência de variáveis de ambiente que contém informações sigilosas, tais como senhas de acesso ao banco de dados ou segredos de encriptação.

## Licença MIT

```
Direitos Reservados 2020 Artur Freire

Permissão é garantida por este meio, livre de ônus, para qualquer pessoa que obtenha uma cópia desde software e arquivos de documentação associados, para lidar com o Software sem restrições, incluindo nenhuma limitação de direitos de uso, cópia, modificação, fusão, publicação, distribuição, sublicenciamento, e/ou venda de cópias do Software, e para permitir que pessoas a quem foi fornecido o Software façam o mesmo, sujeitos às seguintes condições:

A nota de direitos reservados acima, e a nota de permissão devem ser incluídas em todas as cópias ou porções substanciais do Software.

O SOFTWARE É FORNECIDO “COMO É”, SEM QUALQUER TIPO DE GARANTIAS, EXPRESSA OU IMPLÍCITA, INCLUINDO PORÉM AS GARANTIAS DE COMERCIALIZAÇÃO, ADEQUADAS PARA UM DETERMINADO PROPÓSITO E NÃO VIOLAÇÃO. EM NENHUMA HIPÓTESE DEVERÃO OS AUTORES OU DETENTORES DOS DIREITOS AUTORAIS SEREM RESPONSÁVEIS POR ALGUMA RECLAMAÇÃO, DANO OU OUTRA SUSCETIBILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, DELITO OU DE OUTRA FORMA, DECORRENTES, DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS AÇÕES DO SOFTWARE.
```
