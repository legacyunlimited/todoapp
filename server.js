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
  let insertQuery = `insert into person(email, name) 
                     values('${person.email}', '${person.name}')`;

  pool.query(insertQuery, (err, result) => {
    if (!err) {
      res.send("Insertion was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
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
