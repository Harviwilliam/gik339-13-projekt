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
    const { make, model, licensplate, color, year, mileage } = req.body;
    if (!make || !model || !licensplate || !color || !year || !mileage ) {
        res.status(400).json({error: "Invalid request body" });
        return;
    }

    const insertData = db.prepare("INSERT INTO cars (make, mode, licensplate, color, year, mileage VALUES (?, ?, ?, ?, ?, ?");
    insertData.run(make, model, licensplate, color, year, mileage);
    insertData.finalize();


    res.status(201).json({message: "Car added successfully" });
});

//API Endpoint: update a car by ID

server.put("/api/cars/:id", (req, res) => {
    const carId = req.params.id;
    const { make, model, licensplate, color, year, mileage } = req.body;
    if (!make || !model || !licensplate || !color || !year || !mileage ) {
        res.status(400).json({error: "Invalid request body" });
        return;
    }

    db.run("UPDATE cars SET make = ?, model = ?, licensplate = ?, color = ? , year = ?, mileage = ? WHERE id = ?", [make, model, licensplate, color, year, mileage, carId], (err) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({ message: "Car updated successfully" });
    });
});

// API Endpoint: Delete car by ID

server.delete("/api/cars/:id", (req, res) => {
    const carId = req.params.id;
    db.run("DELETE FROM cars WHERE id = ?", [carId], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Car deleted successfully" });
    });
});


