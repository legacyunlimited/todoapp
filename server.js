const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.static("client"));
app.use(cors());

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect();

app.get("/api/todo", (req, res) => {
  pool.query("SELECT * FROM todo").then((result) => {
    res.send(result.rows);
  });
});

app.get("/api/person", (req, res) => {
  pool.query("SELECT * FROM person").then((result) => {
    res.send(result.rows);
  });
});

app.get("/api/todo/:person_id", (req, res) => {
  pool
    .query(`SELECT * FROM todo where person_id =${req.params.person_id} `)
    .then((result) => {
      res.send(result.rows);
    });
});

app.post("/api/person", (req, res) => {
  let person = req.body;
  console.log(person);
  let insertQuery = `insert into person(email, firstname, lastname) 
                     values('${person.email}', '${person.firstname}','${person.lastname}')`;

  pool.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.post("/api/todo", (req, res) => {
  const { task, deadline, personId } = req.body;
  console.log(task, deadline, personId);
  pool.query(
    `INSERT INTO todo (task, deadline, person_id)
    VALUES ($1, $2, $3)`,
    [task, deadline, personId],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error adding todo");
      } else {
        res.status(201).send("Todo added successfully");
      }
    }
  );
});
app.patch("/api/todo/:id", (req, res) => {
  // const todo = todo.find((todo) => todo.id == req.params.id);
  // console.log(todo);
  pool.query(
    "UPDATE todo SET deadline = $1 WHERE id = $2",
    ["2023-04-14", req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.json(result);
      }
    }
  );
});

app.put("/api/todo/:id", (req, res) => {
  let todo = req.body;
  console.log(todo);
  let updateQuery = `update todo SET 
                           task = '${todo.task}' where id = ${req.params.id}`;

  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.delete("/api/todo/:id", (req, res) => {
  let insertQuery = `delete from todo where id=${req.params.id}`;
  pool.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Deletion was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});
