# FinancyIA 💰

Sistema de controle financeiro pessoal aprimorado com IA, baseado no projeto Financy original feito "à mão".

## Stack

### Backend

* **Java 17** + **Spring Boot 3.4**
* **Spring Data JPA** + **Hibernate**
* **PostgreSQL** (mesmo banco do projeto original)
* **Lombok**, Bean Validation

### Frontend

* **React 18** + **TypeScript**
* **Vite** (dev server)
* **Recharts** (gráfico de pizza)
* **Axios** (HTTP client)
* CSS Modules + design system dark mode

\---

## Funcionalidades

|Funcionalidade|Original|FinancyIA|
|-|-|-|
|Registrar ganhos/gastos|✅|✅|
|Visualizar saldo|✅|✅|
|Histórico de transações|✅|✅|
|Editar transação|✅|✅|
|Cancelar transação|✅|✅|
|**Categorias**|❌|✅|
|**Filtros no histórico**|❌|✅|
|**Busca por descrição**|❌|✅|
|**Dashboard com resumo**|❌|✅|
|**Gráfico por categoria**|❌|✅|
|**Paginação**|❌|✅|
|**Validações aprimoradas**|❌|✅|

\---

## Como executar

### Pré-requisitos

* Java 17+
* Maven 3.8+
* Node.js 18+
* PostgreSQL rodando em `localhost:5432`

### Backend

```bash
cd backend
mvn spring-boot:run
```

O servidor sobe em **http://localhost:8081**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O app abre em **http://localhost:5173**

\---

## Banco de dados

O FinancyIA usa o **mesmo banco** do projeto original (`postgres` em `localhost:5432`).

Na primeira inicialização, o Hibernate criará automaticamente:

* Tabela `categoria` com 9 categorias pré-cadastradas
* Coluna `fkcategoria` na tabela `transacao` (nullable)

As tabelas existentes (`transacao`, `tipotransacao`, `statustransacao`) **não são modificadas**.

\---

## Endpoints da API

|Método|Endpoint|Descrição|
|-|-|-|
|`POST`|`/api/transacoes`|Nova transação|
|`GET`|`/api/transacoes`|Listar (com filtros + paginação)|
|`PUT`|`/api/transacoes/{id}`|Editar|
|`PATCH`|`/api/transacoes/{id}/cancelar`|Cancelar|
|`GET`|`/api/resumo`|Resumo financeiro|
|`GET`|`/api/gastos-por-categoria`|Dados para gráfico|
|`GET`|`/api/categorias`|Listar categorias|
|`POST`|`/api/categorias`|Nova categoria|



