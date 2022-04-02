const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

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

  const customers = [];

  app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const customerAlreadyExists = customers.some( (customer) => customer.cpf === cpf );

    if (customerAlreadyExists) {
      return response.status(400).json({ error: "💁 Customer already exist!" });
    }

    customers.push({
      cpf,
      name,
      id: uuidv4(),
      statement: []
    });

    return response.status(201).send();
  });

  app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
      return response.status(400).json({ error: "🔍 Customer not found!" });
    }

    return response.json(customer.statement);
  });
/** Fim Segunda aula */

// app.listen(3333);
app.listen(3333, () => {
  console.log(`${3333} 🚀 Server on!`)
});