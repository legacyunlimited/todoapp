DROP TABLE IF EXISTS todo;
DROP TABLE IF EXISTS person;


CREATE TABLE person (
    id serial PRIMARY KEY,
    name VARCHAR(355),
    email VARCHAR(50)
);

CREATE TABLE todo (
    id serial PRIMARY KEY,
    task VARCHAR(355), 
    deadline DATE NOT NULL,
    person_id int, Foreign Key (person_id) REFERENCES person(id)
    );