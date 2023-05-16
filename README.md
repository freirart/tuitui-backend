<h1 align="center">
	REST API - Tuitui Backend<br/>
</h1>

## Proposta

Este é o repositório do backend do projeto Tuitui, desenvolvido com Node.js, TypeScript e o framework Express.

O objetivo do projeto é fornecer uma API para que os usuários possam criar e visualizar artigos.

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

## Modo de usar

A API é escrita em Node JS e, portanto, deve-se tê-lo instalado.

Utilize a versão do Node contida no package.json.

Caso tenha ao mudar a versão instalada recomenda-se a utilização do [nvm](https://github.com/nvm-sh/nvm).

Uma vez que o node/npm estejam instalados e na versão correta se faz necessário instalar as dependências do projeto. Para isso, basta executar o comando:

```sh
npm install
```

Em seguida, é preciso criar um arquivo .env na raiz do projeto com pelo menos todas as de exemplo contidas no arquivo .env.test.

O ```DATABASE_URL``` deve conter a URL de conexão com o banco de dados, que pode ser local ou remoto. A ```SECRET``` é uma string usada para criptografar as senhas dos usuários.

#### Executando o projeto

Para executar o projeto, basta executar o comando:

```sh
npm run dev
```
Esse comando inicia o servidor localmente na porta **3000**.

Caso deseje levantar um container com a aplicação do mongodb local basta rodar em uma outra instância do terminal a seguinte instrução:

```sh
npm run mongo
```

Para acessar a interface que interage com o banco local basta acessar [esta](http://localhost:8081) rota!

### Consumindo Endpoints

O projeto oferece as seguintes rotas:

Um arquivo json para insominia pode ser baixado [clicando aqui](https://raw.githubusercontent.com/freirart/tuitui-backend/main/public/TUITUI_REQUESTS.json?raw=true).

- GET /articles - Retorna uma lista de artigos[*](/README.md#auth)

- POST /articles - Cria um novo artigo[*](/README.md#auth)

- DELETE /article - Exclui um artigo[*](/README.md#auth)

- PUT /article - Altera informações do artigo[*](/README.md#auth)


- GET /tags - Retorna tags[*](/README.md#auth)

- POST /tags - Cria novas tags[*](/README.md#auth)


- POST /users/signup - Cria um novo usuário

- POST /users/signin - Autentica um usuário

- GET /users - Retorna informções do usuário[*](/README.md#auth)

- DELETE /users - Exclui usuário[*](/README.md#auth)

- PUT /users - Altera algumas informações do usuário[*](/README.md#auth)

<span id="auth">[*](/README.md#auth) Necessário autenticação.<span>

### Testando a aplicação

### Contribuindo

Se você quiser contribuir com o projeto, fique à vontade para abrir uma pull request ou uma issue. Toda ajuda é bem-vinda!

## Licença MIT
Direitos Reservados 2023 Tuitui Project

Este projeto é licenciado sob a licença MIT.
