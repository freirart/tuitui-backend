# Consumindo os Endpoints da Aplicação

## Rotas POST

### Cadastrando um Usuário
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

Em caso de sucesso são retornadas informações do usuário cadastrado junto com um _token_ de acesso às rotas privadas.

### Cadastrando uma Fatura
POST `/faturas/`

O acesso às rotas de `faturas` é dado por meio de um _token JWT_ válido que __deve__ estar presente no cabeçalho da requisição. 

O _token JWT_ __deve__ estar associado à um usuário cadastrado no banco de dados.

O corpo da requisição __deve__ seguir o modelo json:

```
{
  "nome": "Cartão de Crédito",
  "servicos": [
    { "nome": "Mercado", "valor": 199.99 }, 
    { "nome": "Livraria", "valor": 20 }, 
  ],
  "paid": false,
  "validade": '2020/11/16',
}
```

__Nenhum__ dos parâmetros descrito acima __deve__ possuir um valor _falsy_ (null, undefined, '', "", `serviços` vazio), com exceção de `paid` que recebe _false_ por padrão caso não tenha sido informado. A ocorrência desta gafe retorna um erro que informa o parâmetro com dado inválido.

Os objetos contidos no vetor `services` __devem__ seguir o padrão `{ "name": <string>, "value": <number> }`, do contrário a aplicação retornará um erro com o status 400 (_Bad Request_).

O parâmetro `validade` __deve__ seguir o padrão `yyyy/mm/dd`, caso contrário um erro é informado com o status 400 (_Bad Request_).

Quando bem sucedida são retornadas as informações da fatura criada com o status HTTP 201 (_Created_).
## Rotas GET

## Rotas PUT

## Rotas DELETE
