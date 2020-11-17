# Consumindo os Endpoints da Aplicação

Base URL: https://desafio-tecnico-mp.herokuapp.com/

## Rotas POST

<h3 id="cadastrando-um-usuario">Cadastrando um Usuário</h3>

POST `/users/signup`

O corpo da requisição __deve__ conter os parâmetros `username` e `password` como ilustra o json abaixo:

```
{
  "username": "root",
  "password": "root"
}
```

Qualquer outro parâmetro será desconsiderado. 

Se o corpo da requisição não contiver `username` e/ou `password`, a aplicação retornará um erro com status 400 (_Bad Request_).

`username` é um dado __único__ no banco de dados. Ao informar um que já tenha sido escolhido, é retornado uma mensagem de erro com o status 501 (_Not Implemented_).

Em caso de sucesso, são retornadas informações do usuário cadastrado junto a um _token_ de acesso às rotas privadas.

<h3 id="cadastrando-uma-fatura">Cadastrando uma Fatura</h3>

POST `/faturas/`

O acesso às rotas de `faturas` é dado por meio de um _token JWT_ que __deve__ estar presente no cabeçalho da requisição. 

O _token_ __deve__ estar associado à um usuário cadastrado no banco de dados.

O corpo da requisição __deve__ seguir o modelo json:

```
{
  "nome": "Cartão de Crédito",
  "servicos": [
    { "nome": "Mercado", "valor": 199.99 }, 
    { "nome": "Livraria", "valor": 20 }, 
  ],
  "paid": false,
  "validade": "2020/11/16",
}
```

__Nenhum__ dos parâmetros descrito acima __deve__ possuir um valor _falsy_ (null, undefined, '', "", `serviços` vazio), com exceção de `paid` que recebe _false_ por padrão caso não tenha sido informado. A ocorrência desta gafe retorna um erro que informa o parâmetro com dado inválido.

Os objetos contidos no vetor `services` __devem__ seguir o padrão `{ "name": <string>, "value": <number> }`, do contrário a aplicação retornará um erro com o status 400 (_Bad Request_).

O parâmetro `validade` __deve__ seguir o padrão `yyyy/mm/dd`, caso contrário um erro é devolvido com o status 400 (_Bad Request_).

Quando a requisição é bem sucedida são retornadas as informações da fatura criada com o status HTTP 201 (_Created_).

### Signin do Usuário
POST `/users/signin`

As regras da requisição são praticamente iguais às da rota de <a href="#cadastrando-um-usuario">Cadastrando um Usuário</a>.

1. O corpo da requisição __deve__ conter os parâmetros `username` e `password`. Qualquer outro parâmetro será desconsiderado.
2. Se algum dos parâmetros detiver de valores _falsy_, um erro é retornado informando o parâmetro inválido com o status 400 (_Bad Request_).
3. Se `username` e `password` informados não estiverem correlacionados no banco de dados, um erro é devolvido com o status 401 (_Not Authorized_).

Em caso de sucesso, as informações do usuário em questão são retornadas junto com um token de acesso às rotas privadas.
## Rotas GET

Um token JWT deve ser informado no cabeçalho da requisição para acessar estas rotas.

### Obtendo lista de Faturas por página
GET `/faturas/pagination/:pageNumber`

Devolve uma lista de faturas relacionadas ao usuário num sistema de paginação.

Caso nenhum número seja informado no lugar de `:pageNumber`, 0 é tomado como padrão, devolvendo uma lista com as 20 primeiras faturas existentes no banco de dados.

Caso não haja nenhuma lista atrelada ao usuário em questão, devolve-se uma mensagem com o status 204 (_No Content_).

### Obtendo uma Fatura pelo seu _Id_
GET `/faturas/:faturaId`

Devolve a fatura com base em seu _Id_ informado por `:faturaId`.

Caso `:faturaId` seja inválido ou nulo, é retornado um erro com o status 400 (_Bad Request_).

## Rotas PUT

Um token JWT deve ser informado no cabeçalho da requisição para acessar estas rotas.

### Atualizando os dados de uma Fatura
PUT `/faturas/`

As regras da requisição são idênticas às de <a href="cadastrando-uma-fatura">Cadastrando uma Fatura</a>, exceto pela __inclusão do parâmetro _`_id`_ no corpo da requisição__.

O corpo da requisição __deve__ seguir o modelo json:

```
{
  "_id": "Id de alguma Fatura cadastrada no banco de dados"
  "nome": "Cartão de Crédito",
  "servicos": [
    { "nome": "Mercado", "valor": 199.99 }, 
    { "nome": "Livraria", "valor": 20 }, 
  ],
  "paid": false,
  "validade": '2020/11/16',
}
```
## Rotas DELETE

Um token JWT deve ser informado no cabeçalho da requisição para acessar estas rotas.

### Deletando uma Fatura
DELETE `/faturas/:faturaId`

Deleta uma fatura pelo seu _Id_ informado em `:faturaId`.

Caso `:faturaId` seja inválido ou nulo, é retornado um erro com o status 400 (_Bad Request_).
