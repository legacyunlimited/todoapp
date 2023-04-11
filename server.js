const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(cors());

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.connect();

app.get("/person", (req, res) => {
  pool.query("SELECT * FROM person").then((result) => {
    res.send(result.rows);
  });
});

app.post("/person", (req, res) => {
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

app.put("/person", (req, res) => {
  let person = req.body;
  console.log(person);
  let updateQuery = `update person
                       set name = '${person.name}',
                           email = '${person.email}'`;

  pool.query(updateQuery, (err, result) => {
    if (!err) {
      res.send("Update was successful");
    } else {
      console.log(err.message);
    }
  });
  pool.end;
});

app.delete("/person", (req, res) => {
  let insertQuery = `delete from person where id=${req.body.id}`;
  console.log(req.body);
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
