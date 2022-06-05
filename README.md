# Clone Evernote - API

## Introdução

Esse projeto tem como intuito consolidar os conhecimentos adquiridos no curso Desenvolvedor FullStack JavaScript pela OneBitCode e através de pesquisas em portais como GitHub, StackOverflow e Google.

![javascript notes](https://user-images.githubusercontent.com/100682248/172067131-e65a72d8-5a7b-4d56-a441-f92c3ceed1d6.png)

## Techs

Para construção da API, as seguintes tecnologias foram usadas:

* [NodeJS](https://nodejs.org/en/): Interpretador de código fora de um navegador web
* [ExpressJS](https://expressjs.com/): Framework NodeJS que fornece ferramentos para criação de serviços web
* [Mongodb](https://www.mongodb.com/): Bando de dados não relacional para armazenamento de informações.
* [Mongoose](https://mongoosejs.com/): Modelador de banco de dados que conecta o BackEnd com o MongoDB

Outras bibliotecas foram utilizadas, como BCrypt e JSONWebToken, para realizar o processo de Autenticação e Autorização da nossa aplicação.

## Funcionamento

A API foi planejada, tanto o seu corpo como endpoints, com auxilio do POSTMAN. Para um aplicativo de notas, é necessário um usuário e as notas, bem como a relação entre
elas. Os endpoints podem ser visualizados nas rotas e a estrutura de cada item no model. Foi criado um Middleware para autenticação, e a cada novo usuário, ou atualização
em sua senha, a mesma era armazena já criptografada pelo BCrypt. Nosso middleware foi utilizado nas rotas das notas, visto que um usuário precisa estar logado para ter acesso ao conteudo.

## Utilizar
1. `git clone https://github.com/teuz159/Clone-Evernote_API.git` para clonar o projeto
2. `npm install` para instalar todas as dependências do projeto
3. Não se esqueça de se conectar com seu banco de dados na pasta config alterando o database.js
4. `npx nodemon` para iniciar a API. Você pode testar com o POSTMAN.
