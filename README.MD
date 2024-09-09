# Fast Feet
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

### Nesse projeto foi desenvolvido um API para controle de encomendas de uma transportadora, usando tecnologias como Nest com TypeScript, com ORM Prisma controlando bancos de dados, tendo banco de Dados Relacional(PostgreSQL) e não relacional(Redis), incluindo Cloud usando a plataforma Cloudflare

## Pré requisito
-  ### Node: v20.15.1
-  ### Docker: 27.2.0
-  ### Docker Compose: v2.28.1
- ### Conta na Cloudflare

## Etapas
### Instalação das depências do projeto

```bash
npm install 
```

### Iniciar as variáveis de ambiente
```bash
DATABASE_URL="postgresql://postgres:docker@localhost:5432/fast-feet?schema=public"
```

#### Criar bucket no Cloudflare (gratuito)
```bash
CLOUDFLARE_ACCOUNT_ID="" // insira o id da sua conta

AWS_BUCKET_NAME="" // Nome do bucket
AWS_ACCESS_KEY_ID="" // Chave pública de acesso
AWS_SECRET_ACCESS_KEY="" // Chave secreta de acesso
```
#### Criação da public e private key (ChatGPT ou outra IA)
```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```
```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```
#### Converter para base64

```bash
base64 private_key.pem > private_key-base64.txt
```

```bash
base64 public_key.pem > public_key-base64.txt
```

#### Adicionar public e private key no formato base64
```bash 
JWT_PUBLIC_KEY="" // chave pública em base64
JWT_PRIVATE_KEY="" // chave privada em base64
```
 
### Iniciar o banco de dados (Precisa do Docker e Docker Compose)

```bash
docker compose up -d 
```

### Iniciar a API 

```bash
npm run start:dev
```
#### Porta default http://localhost:3333

## API Endpoints
#### Rotas Públicas (sem necessidade da chave de acesso JWT)
```bash
POST /register # registra um novo entregador
POST /admin # registra um novo admin (senha de admin: admin123)
POST /sessions # retorna um token de autenticação para JWT
```
#### Rotas Privadas (necessidade da chave de acesso JWT)
```bash
POST /recipients # registra um novo cliente (somente admin)
POST /orders # registra um novo pedido (somente admin)
PUT /deliveryman/edit/:id # edita um entregador
PUT /order/edit/:orderId # edita um pedido (somente admin)
PUT /recipient/edit/:id # edita um cliente (somente admin)
DELETE /deliveryman/:id # deleta um entregador (somente admin)
DELETE /order/:id # deleta um pedido (somente admin)
DELETE /recipient/:id # deleta um cliente (somente admin)
GET /orders/nearby/:deliverymanId # busca todos os pedidos em um raio de 10km
GET /deliveryman/city/:deliverymanId # busca todos os pedidos filtrado por cidade
GET /deliveryman/orders/:deliverymanId # busca todos os pedidos aceitos pelo entregador
GET /deliveryman/:cpf # busca dados do entregador
GET /recipient/:adminId/:email # busca dados do cliente 
PUT /order/withdraw/:orderId # entregador aceita um pedido
POST /order/completed/:orderId # finaliza uma entrega com a foto da encomenda
PACTH /notifications/:notificationId/read # vizualiza a notificação
POST /attachments # faz o upload da foto da encomenda
```
## Autenticação
### Autenticação é JWT, feita por meio da rota [POST] /sessions
```bash
# 1 Passo - criar uma conta

POST /register

body:
        {
            "name": "John Doe",
            "cpf": "11112406355",
            "password": "123456",
            "latitude": -23.623352,
            "longitude": -46.558612
        }

# 2 passo - fazer login

POST /sessions

body:
        {
            "name": "John Doe",
            "cpf": "11112406355",
        }

# 3 passo - com retorno da chave de acesso

Auth Type:  Bearer Token
Token: # chave retornada de /sessions

```