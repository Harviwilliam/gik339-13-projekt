const express = require("express");
const server = express();
const sqlite3 = require("sqlite3").verbose();

server
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

server.listen(3000, () => {
  console.log("Server is now running on http://localhost:3000.");
});

const db = new sqlite3.Database("cars.db");

db.run('CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, make TEXT, model TEXT, licenseplate TEXT, color TEXT, year INTEGER , mileage INTEGER)');

//API Endpoint: Get all cars

server.get("/api/cars", (req, res) => {
    db.all("SELECT * FROM cars", (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json(rows);
    });
});

//API Endpoint: Get a specific car by ID

server.get("/api/cars/:id", (req, res) => {
    const carId = req.params.id;
    db.get("SELECT * FROM cars WHERE id = ?", [carId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        if(!row) {
            res.status(404).json({error: "Car no found"});
            return;
        }
        res.json(row);
    });
});

//API Endpoint: Add new car

server.post("/api/cars", (req, res) => {
    
})