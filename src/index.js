const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json()); //Usamos esse middleware para podermos receber dados JSON vindos do frontend

/** Primeira aula */
  /**
   * Tipos de Requisições
   * 
   * GET => Buscar uma informação dentro do servidor
   * POST => Inserir uma informação no servidor
   * PUT => Alterar uma informação no servidor
   * PATCH => Alterar uma informação especifica
   * DELETE => Deletar uma informação no servidor
   */

  /**
   * Tipos de parâmetros
   * 
   * Route Params => Identificar um recurso para que possamos editar/deletar/buscar
   * Query Params => Paginação / Filtro
   * Body Params => Os objetos que enviaremos para inserção e ou alteração serão sempre no formato JSON -> Para podermos receber o JSON em nossas requisições e não retornar "undefined" precisamos usar um middware -> app.use(express.json());
   */

  app.get("/", (request, response) => {
    return response.json({ mesage:"Hello World Ignite!"});
  });

  app.get("/courses", (request, response) => {
    const query = request.query;
    console.log(query);

    return response.json(["Curso 1", "Curso 2", "Curso 3"]);
  });

  app.post("/courses", (request, response) => {
    const body = request.body;
    console.log(body);

    return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
  });

  app.put("/courses/:id", (request, response) => {
    const { id } = request.params;
    console.log(id);

    return response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
  });

  app.patch("/courses/:id", (request, response) => {
    return response.json(["Curso 6", "Curso 7", "Curso 3", "Curso 4"]);
  });

  app.delete("/courses/:id", (request, response) => {
    return response.json(["Curso 6", "Curso 2","Curso 4"]);
  });
/** Fim Primeira aula */

/** Segunda aula */
  /**
   * cpf - string
   * name - string
   * id - uuid
   * statement []
   */

  const customers = []; //Array vazio para simular um banco de dados

  //Middleware
  function verifyIfExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
      return response.status(400).json({ error: "🔍 Customer not found!" });
    }

    request.customer = customer; //Dessa forma eu consigo passar a informação para a rota

    return next();
  }

  function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
      if(operation.type === 'credit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    return balance;
  }

  app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some( (customer) => customer.cpf === cpf );

    if (customerAlreadyExists) {
      return response.status(400).json({ error: "💁 Customer already exist!" });
    }

    customers.push({ //A função push é usada para adicionar dados em um array
      cpf,
      name,
      id: uuidv4(),
      statement: []
    });

    return response.status(201).json({ mesage: "🎉 Customer created!" });
  });

  app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request; //Dessa forma eu recupero a informação processada no middleware

    return response.json(customer.statement);
  });

  app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: "credit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).json({ mesage: "🥳 Deposit made successfully!" });
  });

  app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
      return response.status(400).json({ error: "😔 Insufficient funds!" });
    }

    const statementOperation = {
      amount,
      created_at: new Date(),
      type: "debit"
    };

    customer.statement.push(statementOperation);

    return response.status(201).json({ mesage: "💸 Withdraw sucessfuly!" });

  });
/** Fim Segunda aula */

// app.listen(3333);
app.listen(3333, () => {
  console.log(`${3333} 🚀 Server on!`)
});